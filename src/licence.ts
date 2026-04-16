// ================================================================
// licence.ts — Interrupteur gratuit / premium
// Pour passer en premium : changer 'gratuit' en 'premium'
// PapiMougeotIA · Avril 2026
// ================================================================

export type ModeLicence = 'gratuit' | 'premium';

export let LICENCE: ModeLicence = 'gratuit';

// ----------------------------------------------------------------
// Ce qui est accessible par mode
// ----------------------------------------------------------------

export const ACCES = {
  ongletScoreADN: true,
  ongletGenes:    false,
  ongletMarathon: true,
  ongletTamis:    false,
  ongletBPG:      false,
  tripleA:        false,
  tripleB:        false,
  jamais:         true,
  annonces:       false,
};

// ----------------------------------------------------------------
// Message affiché pour les fonctions premium
// ----------------------------------------------------------------

export const MSG_PREMIUM =
  'Fonctionnalité réservée aux membres Premium.';
