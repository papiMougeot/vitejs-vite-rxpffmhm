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
  // Onglets du Bouloscope
  ongletScoreADN:  true,              // toujours visible
  ongletGenes:     LICENCE === 'premium',
  ongletMarathon:  true,              // toujours visible
  ongletTamis:     LICENCE === 'premium',
  ongletBPG:       LICENCE === 'premium',

  // Signaux détaillés
  tripleA:         LICENCE === 'premium',
  tripleB:         LICENCE === 'premium',
  jamais:          true,              // toujours visible
  annonces:        LICENCE === 'premium',
};

// ----------------------------------------------------------------
// Message affiché pour les fonctions premium
// ----------------------------------------------------------------

export const MSG_PREMIUM =
  'Fonctionnalité réservée aux membres Premium.';
