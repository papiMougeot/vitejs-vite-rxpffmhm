// src/lune.ts
// LE CERVEAU LUNAIRE DU BOULOTRON 🌑🌓🌕

// Durée d'un cycle lunaire (Mois synodique)
const DUREE_CYCLE = 29.53058867;

// Une date de référence de Nouvelle Lune (6 Janvier 2000)
const REFERENCE_NL = new Date('2000-01-06T12:24:01');

export type PhaseLune = {
  id: string;      // Ex: PL, DC, NL...
  nom: string;     // Ex: Pleine Lune
  icone: string;   // 🌑, 🌓, 🌕...
  conseil: string; // Le conseil stratégique
  favorable: boolean; // Est-ce la fameuse "Fenêtre de Tir" ?
};

export function obtenirPhaseLunaire(date: Date = new Date()): PhaseLune {
  // 1. Calcul du nombre de jours écoulés depuis la référence
  const diffTime = date.getTime() - REFERENCE_NL.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // 2. Où en est-on dans le cycle actuel ? (de 0 à 29.53)
  const joursDansCycle = diffDays % DUREE_CYCLE;
  
  // 3. Calcul de l'âge de la lune (de 0 à 1, où 0.5 = Pleine Lune)
  const age = joursDansCycle / DUREE_CYCLE;

  // 4. Détermination de la phase (Découpage en 8 parts)
  // On décale de 1/16 pour centrer les phases
  // 0.00 - 0.06 : NL
  // 0.06 - 0.18 : PC
  // etc...
  
  // Note : PL est à 0.5 (Milieu)
  
  if (age < 0.06 || age > 0.94) return { id: 'NL', nom: 'Nouvelle Lune', icone: '🌑', favorable: false, conseil: 'Phase calme. Misez peu.' };
  if (age < 0.18) return { id: 'PC', nom: 'Premier Croissant', icone: '🌒', favorable: false, conseil: 'Montée en puissance.' };
  if (age < 0.31) return { id: 'PQ', nom: 'Premier Quartier', icone: '🌓', favorable: false, conseil: 'Zone Froide. Prudence.' }; // [cite: 119]
  if (age < 0.44) return { id: 'GC', nom: 'Gibbeuse Croiss.', icone: '🌔', favorable: false, conseil: 'Jackpot en accumulation.' };
  
  // LA FENETRE DE TIR (PL + DC) [cite: 111, 112]
  if (age < 0.56) return { id: 'PL', nom: 'Pleine Lune', icone: '🌕', favorable: true, conseil: '🔥 ZONE CHAUDE ! Taux de gains max (27%).' };
  if (age < 0.69) return { id: 'GD', nom: 'Gibbeuse Décr.', icone: '🌖', favorable: false, conseil: 'Retombée de pression.' };
  if (age < 0.81) return { id: 'DQ', nom: 'Dernier Quartier', icone: '🌗', favorable: false, conseil: 'Gros jackpots possibles.' };
  
  // DC est aussi très favorable [cite: 112]
  return { id: 'DC', nom: 'Dernier Croissant', icone: '🌘', favorable: true, conseil: '🔥 ZONE CHAUDE ! Dernière chance du cycle.' };
}