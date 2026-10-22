// fermionStars.ts — module Boulotron
// Statistique de Fermi-Dirac appliquée aux étoiles EuroMillions (2 parmi 12, depuis le 27/09/2016).
// Test du χ² sur les occupations (corrigé de l'exclusion) et sur les 66 paires.
import { H } from "./tiragesFDJ";

export type Tirage = [number, number]; // deux étoiles distinctes, 1..12

const K = 12;           // états (numéros d'étoiles)
const NB_PAIRES = 66;   // C(12,2)

// ---------- Fonction gamma incomplète (p-value du χ²) ----------
function lnGamma(z: number): number {
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/** Q(a,x) = 1 − P(a,x), gamma incomplète régularisée supérieure */
function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  if (x < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n); sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) break;
    }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

export const pValueChi2 = (x2: number, ddl: number) => gammaQ(ddl / 2, x2 / 2);

// ---------- Analyse ----------
export interface ResultatFermion {
  N: number;
  occupation: number[];      // index 1..12, comptes bruts
  tauxOccupation: number[];  // attendu 1/6
  energie: number[];         // ln(1/n − 1), attendu ln 5 ≈ 1,609
  entropieBits: number;      // max log2(12) ≈ 3,585 par étoile
  chi2Occupation: number;    // corrigé du facteur d'exclusion 11/10, ddl 11
  pOccupation: number;
  paires: number[][];        // [i][j], i<j
  residusPaires: number[][]; // (O − E)/√E
  chi2Paires: number;        // ddl 65
  pPaires: number;
}

export function analyseFermion(tirages: Tirage[]): ResultatFermion {
  const N = tirages.length;
  const occupation = Array(K + 1).fill(0);
  const paires = Array.from({ length: K + 1 }, () => Array(K + 1).fill(0));

  for (const [a, b] of tirages) {
    if (a === b || a < 1 || b < 1 || a > K || b > K) continue; // Pauli : jamais deux fois la même
    occupation[a]++; occupation[b]++;
    paires[Math.min(a, b)][Math.max(a, b)]++;
  }

  const tauxOccupation = occupation.map(c => c / N);
  const energie = tauxOccupation.map(n => (n > 0 && n < 1 ? Math.log(1 / n - 1) : NaN));

  const p = occupation.slice(1).map(c => c / (2 * N));
  const entropieBits = -p.reduce((s, x) => s + (x > 0 ? x * Math.log2(x) : 0), 0);

  // χ² des occupations. Un χ² multinomial classique suppose des tirages AVEC remise.
  // Sans remise (exclusion), la variance de chaque compte vaut 10/11 de la variance
  // multinomiale : on multiplie donc par 11/10 pour retrouver un χ²(11).
  const Eocc = (2 * N) / K;
  let s = 0;
  for (let i = 1; i <= K; i++) s += (occupation[i] - Eocc) ** 2 / Eocc;
  const chi2Occupation = (s * 11) / 10;

  // χ² des paires : chaque tirage tombe dans une des 66 cases → multinomial exact.
  const Ep = N / NB_PAIRES;
  const residusPaires = Array.from({ length: K + 1 }, () => Array(K + 1).fill(0));
  let chi2Paires = 0;
  for (let i = 1; i <= K; i++)
    for (let j = i + 1; j <= K; j++) {
      const r = (paires[i][j] - Ep) / Math.sqrt(Ep);
      residusPaires[i][j] = residusPaires[j][i] = r;
      chi2Paires += r * r;
    }

  return {
    N, occupation, tauxOccupation, energie, entropieBits,
    chi2Occupation, pOccupation: pValueChi2(chi2Occupation, K - 1),
    paires, residusPaires,
    chi2Paires, pPaires: pValueChi2(chi2Paires, NB_PAIRES - 1),
  };
}

/** Lecture verbeuse d'une p-value pour l'interface */
export function lecturePValue(p: number): string {
  if (p < 0.001) return "écart très significatif : à vérifier (données, période, saisie)";
  if (p < 0.05) return "écart significatif au seuil de 5 %";
  if (p > 0.99) return "trop parfait : distribution suspecte d'uniformité excessive";
  return "compatible avec un tirage équitable";
}
  // ---------- Adaptateur pour tiragesFDJ.ts ----------

/** Premier tirage à 12 étoiles : mardi 27/09/2016 */
const PREMIER_12_ETOILES = [6, 9, 13, 39, 41, 2, 12];

/** Tirages de l'ère 12 étoiles, du plus récent au plus ancien */
export function tiragesEre12(): Tirage[] {
  const idx = H.findIndex(t => t.every((v, k) => v === PREMIER_12_ETOILES[k]));
  if (idx === -1) {
    console.warn("fermionStars : tirage du 27/09/2016 introuvable dans H, analyse sur tout l'historique");
  }
  const ere = idx === -1 ? H : H.slice(0, idx + 1);
  return ere.map(t => [t[5], t[6]] as Tirage);
}

/** Analyse prête à l'emploi */
export const analyseEtoiles = () => analyseFermion(tiragesEre12());
