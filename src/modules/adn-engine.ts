// ================================================================
// adn-engine.ts — Moteur dynamique des gènes A→K
// Calcule les signaux dynamiques pour chaque numéro 1→50
// À partir des 1936 tirages historiques
// PapiMougeotIA · Avril 2026
// ================================================================

// ----------------------------------------------------------------
// TYPES EXPORTÉS
// ----------------------------------------------------------------

export type Temperature = 'glacé' | 'froid' | 'normal' | 'chaud' | 'brûlant';
export type GroupementEcart = 'G1' | 'G2' | 'G3';

export interface GenesDynamiques {
  numero: number;

  // --- Gène A — Écart ---
  ecartActuel:       number;
  ecartMaxHistorique: number;
  enRupture:         boolean;   // écart actuel > max historique
  groupementEcart:   GroupementEcart;

  // --- Gène B — Fréquence / Température ---
  nbSorties:         number;
  temperature:       Temperature;
  ratioFreq:         number;    // nbSorties / (nbTirages * 5/50)

  // --- Gène C — Streak (Règle A) ---
  streakActuel:      number;    // sorties consécutives récentes
  enStreakDanger:    boolean;   // streak >= 2 → Règle A

  // --- Gène D — Cascade voisin ---
  cascadeActive:     boolean;   // voisin immédiat sorti au dernier tirage

  // --- Gène E — Dizaine et profil ---
  dizaine:           number;    // 1 à 5
  profil1Dizaine:    number[];  // quelles dizaines dans le dernier tirage

  // --- Gène F — Co-occurrences (partenaires fréquents) ---
  top5Partners:      number[];  // 5 numéros sortis le plus souvent avec lui

  // --- Gène G — Annoncés A(+) et A(-) ---
  estAnnoncePlus:    boolean;   // attiré par un numéro du dernier tirage
  estAnnoncesMoins:  boolean;   // repoussé par un numéro du dernier tirage
  nbVotesPlus:       number;    // combien de numéros du dernier tirage l'annoncent
  annonceursPrincipaux: number[]; // numéros qui l'annoncent le plus fort

  // --- Gène H — FAVORIT ---
  favoritEcart:      number;    // argmax(distribution_écarts)
  nbFoisFavorit:     number;    // nb de fois revenu à cet écart exact
  signalFavorit:     boolean;   // ecartActuel === favoritEcart

  // --- Gène I — FORME ---
  enForme:           boolean;   // freq récente >= 2 sur fenêtre
  enFormePourrait:   boolean;   // en forme ET écart = 0

  // --- DOUBLON = H ∩ I ---
  estDoublon:        boolean;

  // --- Gène J — Retard Moy. Théorique ---
  nbFoisReelAcetEcart: number;  // nb fois revenu à l'écart actuel exact
  nbFoisTheoAcetEcart: number;  // référence théorique
  retardMoyTheo:     number;    // nbFoisTheo - nbFoisReel
  ratioRetard:       number;    // nbFoisReel / nbFoisTheo  (<1 = retard)
  enRetardMoyTheo:   boolean;

  // --- Triple A = Doublon + Retard MT ---
  tripleA:           boolean;

  // --- Gène K — JAMAIS à cet écart exact ---
  jamaisAcetEcart:   boolean;

  // --- Score global ---
  scoreSelection:    number;    // nb de critères cumulés (précurseur scoreTotal ADN)
}

export interface BouloscopeData {
  genes:             Record<number, GenesDynamiques>;
  doublons:          number[];  // numéros en Doublon
  tripleA:           number[];  // numéros en Triple A
  tripleB:           number[];  // numéros en Triple B
  jamais:            number[];  // numéros JAMAIS à leur écart
  top5Score:         number[];  // 5 numéros avec meilleur scoreSelection
  profilDizaines:    number[];  // distribution dizaines du dernier tirage [d1,d2,d3,d4,d5]
  signalG3:          boolean;   // plus de 38% des numéros en G3
  pctG3:             number;
  dernierTirage:     number[];
}

// ----------------------------------------------------------------
// CONSTANTES
// ----------------------------------------------------------------

const NB_NUMEROS = 50;
const NB_ETOILES = 12;

// Seuils groupements d'écarts (découverte Papi Mougeot 1971)
const SEUIL_G1 = 3;   // G1 : écarts 0 à 3
const SEUIL_G2 = 10;  // G2 : écarts 4 à 10
                      // G3 : écarts 11+

// Fenêtre "En FORME"
const FENETRE_FORME = 10; // derniers tirages

// Seuil A(+) et A(-) pour la matrice des annoncés
const SEUIL_PLUS_RATIO  = 1.30;
const SEUIL_MOINS_RATIO = 0.70;

// ----------------------------------------------------------------
// FONCTION PRINCIPALE
// ----------------------------------------------------------------

export function calculerBouloscopeData(
  tirages: number[][],          // H de tiragesFDJ : index 0 = plus récent
  dernierTirage: number[]       // les 5 boules du dernier tirage
): BouloscopeData {

  const N = tirages.length;

  // Chronologique (T1 à T_N)
  const chronologique = [...tirages].reverse();

  // ---- Pré-calcul : positions de sortie par numéro ----
  const positions: Record<number, number[]> = {};
  for (let n = 1; n <= NB_NUMEROS; n++) {
    positions[n] = chronologique
      .map((t, i) => (t.slice(0,5).includes(n) ? i : -1))
      .filter(i => i >= 0);
  }

  // ---- Écarts actuels ----
  const ecarts: Record<number, number> = {};
  for (let n = 1; n <= NB_NUMEROS; n++) {
    const pos = positions[n];
    if (pos.length === 0) {
      ecarts[n] = N; // jamais sorti
    } else {
      ecarts[n] = N - 1 - pos[pos.length - 1];
    }
  }

  // ---- Distribution globale des écarts (pour nbFoisTheo) ----
  const distribGlobale: number[] = new Array(N).fill(0);
  for (let n = 1; n <= NB_NUMEROS; n++) {
    const pos = positions[n];
    for (let i = 1; i < pos.length; i++) {
      const e = pos[i] - pos[i-1] - 1;
      if (e < N) distribGlobale[e]++;
    }
  }
  // nbFoisTheo[k] = distribGlobale[k] / 50
  const nbFoisTheo = distribGlobale.map(v => v / NB_NUMEROS);

  // ---- Matrice annoncés 50×50 ----
  const annonces: number[][] = Array.from({length: 51}, () => new Array(51).fill(0));
  for (let i = 0; i < chronologique.length - 1; i++) {
    const tirageCourant  = chronologique[i].slice(0, 5);
    const tirageSuivant  = chronologique[i+1].slice(0, 5);
    for (const src of tirageCourant) {
      for (const cib of tirageSuivant) {
        if (src >= 1 && src <= 50 && cib >= 1 && cib <= 50) {
          annonces[src][cib]++;
        }
      }
    }
  }

  // ---- Co-occurrences simultanées ----
  const coOcc: number[][] = Array.from({length: 51}, () => new Array(51).fill(0));
  for (const tirage of chronologique) {
    const boules = tirage.slice(0, 5);
    for (let i = 0; i < boules.length; i++) {
      for (let j = i+1; j < boules.length; j++) {
        const a = boules[i], b = boules[j];
        if (a >= 1 && a <= 50 && b >= 1 && b <= 50) {
          coOcc[a][b]++;
          coOcc[b][a]++;
        }
      }
    }
  }

  // ---- Calcul des gènes pour chaque numéro ----
  const genes: Record<number, GenesDynamiques> = {};

  for (let n = 1; n <= NB_NUMEROS; n++) {
    const pos = positions[n];
    const nbSorties = pos.length;
    const ecartActuel = ecarts[n];

    // --- Gène A ---
    let ecartMax = 0;
    for (let i = 1; i < pos.length; i++) {
      const e = pos[i] - pos[i-1] - 1;
      if (e > ecartMax) ecartMax = e;
    }
    // Compter aussi depuis la dernière sortie jusqu'à maintenant
    if (pos.length > 0) {
      const depuisDebut = pos[0];
      if (depuisDebut > ecartMax) ecartMax = depuisDebut;
    }
    const enRupture = ecartActuel > ecartMax && ecartMax > 0;

    let groupementEcart: GroupementEcart = 'G3';
    if (ecartActuel <= SEUIL_G1)      groupementEcart = 'G1';
    else if (ecartActuel <= SEUIL_G2) groupementEcart = 'G2';

    // --- Gène B — Température ---
    const ratioFreq = nbSorties / (N * 5 / 50);
    let temperature: Temperature = 'normal';
    if (ecartActuel === 0)         temperature = 'brûlant';
    else if (ecartActuel <= 3)     temperature = 'chaud';
    else if (ecartActuel <= 10)    temperature = 'normal';
    else if (ecartActuel <= 25)    temperature = 'froid';
    else                           temperature = 'glacé';

    // --- Gène C — Streak ---
    let streakActuel = 0;
    for (let i = pos.length - 1; i >= 1; i--) {
      if (pos[i] - pos[i-1] === 1) streakActuel++;
      else break;
    }
    if (ecartActuel === 0) streakActuel++;
    const enStreakDanger = streakActuel >= 2;

    // --- Gène D — Cascade voisin ---
    // voisin circulaire = (n-2+50)%50+1 et n%50+1
    const voisinSuiv = n % 50 + 1;
    const voisinPrec = (n - 2 + 50) % 50 + 1;
    const cascadeActive = dernierTirage.includes(voisinSuiv) || dernierTirage.includes(voisinPrec);

    // --- Gène E — Dizaine ---
    const dizaine = Math.ceil(n / 10);
    const profilDizaines5 = [0,0,0,0,0];
    for (const b of dernierTirage) {
      const d = Math.ceil(b / 10) - 1;
      if (d >= 0 && d < 5) profilDizaines5[d]++;
    }

    // --- Gène F — Co-occurrences ---
    const partners = coOcc[n]
      .map((v, i) => ({n: i, v}))
      .filter(x => x.n >= 1 && x.n <= 50 && x.n !== n)
      .sort((a, b) => b.v - a.v)
      .slice(0, 5)
      .map(x => x.n);

    // --- Gène G — Annoncés ---
    // Espérance : somme de la ligne / 50
    let estAnnoncePlus = false;
    let estAnnoncesMoins = false;
    let nbVotesPlus = 0;
    const annonceursPrincipaux: number[] = [];

    for (const src of dernierTirage) {
      if (src < 1 || src > 50) continue;
      const totalLigne = annonces[src].reduce((s, v) => s + v, 0);
      const esp = totalLigne / 50;
      if (esp <= 0) continue;
      const ratio = annonces[src][n] / esp;
      if (ratio >= SEUIL_PLUS_RATIO) {
        estAnnoncePlus = true;
        nbVotesPlus++;
        annonceursPrincipaux.push(src);
      } else if (ratio <= SEUIL_MOINS_RATIO) {
        estAnnoncesMoins = true;
      }
    }

    // --- Gène H — FAVORIT ---
    const distEcarts: number[] = new Array(Math.max(60, N)).fill(0);
    for (let i = 1; i < pos.length; i++) {
      const e = pos[i] - pos[i-1] - 1;
      if (e < distEcarts.length) distEcarts[e]++;
    }
    let favoritEcart = 0;
    let nbFoisFavorit = 0;
    for (let k = 0; k < distEcarts.length; k++) {
      if (distEcarts[k] > nbFoisFavorit) {
        nbFoisFavorit = distEcarts[k];
        favoritEcart  = k;
      }
    }
    const signalFavorit = ecartActuel === favoritEcart && nbFoisFavorit >= 3;

    // --- Gène I — FORME ---
    const sortiesRecentes = chronologique
      .slice(Math.max(0, N - FENETRE_FORME))
      .filter(t => t.slice(0,5).includes(n)).length;
    const enForme = sortiesRecentes >= 2;
    const enFormePourrait = enForme && ecartActuel === 0;

    // --- DOUBLON ---
    const estDoublon = signalFavorit && enForme;

    // --- Gène J — Retard Moy. Théorique ---
    const nbFoisReelAcetEcart = distEcarts[ecartActuel] || 0;
    const nbFoisTheoAcetEcart = nbFoisTheo[ecartActuel] || 0;
    const retardMoyTheo = nbFoisTheoAcetEcart - nbFoisReelAcetEcart;
    const ratioRetard = nbFoisTheoAcetEcart > 0
      ? nbFoisReelAcetEcart / nbFoisTheoAcetEcart
      : 1;
    const enRetardMoyTheo = retardMoyTheo > 0;

    // --- Triple A ---
    const tripleA = estDoublon && enRetardMoyTheo;

    // --- Gène K — JAMAIS ---
    const jamaisAcetEcart = ecartActuel > 0 && nbFoisReelAcetEcart === 0;

    // --- Score ---
    let scoreSelection = 0;
    if (signalFavorit)        scoreSelection++;
    if (enForme)              scoreSelection++;
    if (estDoublon)           scoreSelection++;
    if (enRetardMoyTheo)      scoreSelection++;
    if (estAnnoncePlus)       scoreSelection += nbVotesPlus;
    if (jamaisAcetEcart)      scoreSelection++;
    if (cascadeActive)        scoreSelection++;
    if (tripleA)              scoreSelection++;

    genes[n] = {
      numero: n,
      ecartActuel, ecartMaxHistorique: ecartMax, enRupture, groupementEcart,
      nbSorties, temperature, ratioFreq,
      streakActuel, enStreakDanger,
      cascadeActive,
      dizaine, profil1Dizaine: profilDizaines5,
      top5Partners: partners,
      estAnnoncePlus, estAnnoncesMoins, nbVotesPlus, annonceursPrincipaux,
      favoritEcart, nbFoisFavorit, signalFavorit,
      enForme, enFormePourrait,
      estDoublon,
      nbFoisReelAcetEcart, nbFoisTheoAcetEcart,
      retardMoyTheo, ratioRetard, enRetardMoyTheo,
      tripleA,
      jamaisAcetEcart,
      scoreSelection,
    };
  }

  // ---- Synthèse globale ----

  const doublons  = Object.values(genes).filter(g => g.estDoublon).map(g => g.numero);
  const tripleAList = Object.values(genes).filter(g => g.tripleA).map(g => g.numero);

  // Triple B = Doublon + Annoncé A(+)
  const tripleBList = Object.values(genes)
    .filter(g => g.estDoublon && g.estAnnoncePlus)
    .map(g => g.numero);

  const jamaisList = Object.values(genes).filter(g => g.jamaisAcetEcart).map(g => g.numero);

  const top5Score = Object.values(genes)
    .sort((a, b) => b.scoreSelection - a.scoreSelection)
    .slice(0, 5)
    .map(g => g.numero);

  // Profil dizaines du dernier tirage
  const profilDizaines = [0,0,0,0,0];
  for (const b of dernierTirage) {
    const d = Math.ceil(b / 10) - 1;
    if (d >= 0 && d < 5) profilDizaines[d]++;
  }

  // Signal G3
  const nbG3 = Object.values(genes).filter(g => g.groupementEcart === 'G3').length;
  const pctG3 = nbG3 / NB_NUMEROS;
  const signalG3 = pctG3 > 0.38;

  return {
    genes,
    doublons,
    tripleA: tripleAList,
    tripleB: tripleBList,
    jamais:  jamaisList,
    top5Score,
    profilDizaines,
    signalG3,
    pctG3: Math.round(pctG3 * 1000) / 10,
    dernierTirage,
  };
}

// ----------------------------------------------------------------
// FONCTION UTILITAIRE : Résumé lisible pour le Bouloscope
// ----------------------------------------------------------------

export function getResumeBouloscope(data: BouloscopeData): string {
  const lignes: string[] = [];
  if (data.tripleA.length > 0)
    lignes.push(`Triple A : ${data.tripleA.join(', ')}`);
  if (data.tripleB.length > 0)
    lignes.push(`Triple B : ${data.tripleB.join(', ')}`);
  if (data.doublons.length > 0)
    lignes.push(`Doublons : ${data.doublons.join(', ')}`);
  if (data.jamais.length > 0)
    lignes.push(`JAMAIS : ${data.jamais.join(', ')}`);
  if (data.signalG3)
    lignes.push(`⚠️ Signal G3 : ${data.pctG3}% de numéros froids`);
  return lignes.join(' | ');
}
