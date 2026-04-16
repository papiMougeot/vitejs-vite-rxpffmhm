// ================================================================
// BouloscopeModal.tsx — Le Microscope des Boules
// Philosophie : observer l'état du terrain, pas prédire
// Fidèle au proto approuvé par Papi Mougeot
// PapiMougeotIA · 16 Avril 2026
// ================================================================

import React, { useState, useMemo } from 'react';
import { BouloscopeData } from './modules/adn-engine';
import { getBpgPartenaires } from './modules/bpg-data';

// ----------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------
type Onglet = 'score' | 'genes' | 'marathon' | 'tamis' | 'bpg';

interface Props {
  data:      BouloscopeData;
  balls:     number[];
  stars:     number[];
  tirages:   number[][];
  source:    string;
  onClose:   () => void;
}

// ----------------------------------------------------------------
// STYLES COMMUNS
// ----------------------------------------------------------------
const card: React.CSSProperties = {
  background: '#1e3a5f', borderRadius: '10px',
  padding: '12px', marginBottom: '10px',
};
const secHead: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '.05em',
  color: '#64748b', marginBottom: '8px',
};
const row: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '8px 10px', background: '#1e3a5f',
  borderRadius: '6px', marginBottom: '4px',
};
function key(bg: string): React.CSSProperties {
  return {
    width: '20px', height: '20px', borderRadius: '50%',
    background: bg, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '10px',
    fontWeight: 'bold', color: '#fff', flexShrink: 0,
  };
}

// ----------------------------------------------------------------
// CALCUL MARATHON
// ----------------------------------------------------------------
function calculerMarathon(balls: number[], stars: number[], tirages: number[][]) {
  const grille: number[][] = Array.from({length: 6}, () => [0, 0, 0]);
  for (const t of tirages) {
    const tb = t.slice(0, 5);
    const ts = t.slice(5, 7);
    const nb = balls.filter(b => tb.includes(b)).length;
    const ns = stars.filter(s => ts.includes(s)).length;
    if (nb <= 5 && ns <= 2) grille[nb][ns]++;
  }
  return grille;
}

// ----------------------------------------------------------------
// ONGLET SCORE ADN
// ----------------------------------------------------------------
function OngletScore({ data, balls }: { data: BouloscopeData; balls: number[] }) {
  const doublons = balls.filter(n => data.doublons.includes(n));
  const tripleA  = balls.filter(n => data.tripleA.includes(n));
  const tripleB  = balls.filter(n => data.tripleB.includes(n));
  const jamais   = balls.filter(n => data.genes[n]?.jamaisAcetEcart);

  const score = Math.min(100, Math.round(
    doublons.length * 15 +
    tripleA.length  * 20 +
    tripleB.length  * 20 +
    (data.signalG3 ? 10 : 0) +
    jamais.length   * 10
  ));

  const badges: { label: string; bg: string; color: string; border: string }[] = [];
  doublons.forEach(n => badges.push({ label: `Doublon N°${n}`,
    bg: 'rgba(234,179,8,.2)', color: '#fde68a',
    border: '0.5px solid rgba(234,179,8,.4)' }));
  tripleA.forEach(n => badges.push({ label: `Triple A — N°${n}`,
    bg: 'rgba(239,68,68,.2)', color: '#fca5a5',
    border: '0.5px solid rgba(239,68,68,.4)' }));
  tripleB.forEach(n => badges.push({ label: `Triple B — N°${n}`,
    bg: 'rgba(239,68,68,.2)', color: '#fca5a5',
    border: '0.5px solid rgba(239,68,68,.4)' }));

  const convergences = [
    tripleA.length > 0 ? { k: 'A', bg: '#ef4444', nom: 'Triple A',
      val: `N°${tripleA.join(', ')} — Doublon + Retard MT`, vc: '#fca5a5' } : null,
    tripleB.length > 0 ? { k: 'B', bg: '#3b82f6', nom: 'Triple B',
      val: `N°${tripleB.join(', ')} — Doublon + Annoncé A(+)`, vc: '#86efac' } : null,
    data.signalG3 ? { k: 'C', bg: '#d97706', nom: 'Signal G3',
      val: `${data.pctG3}% — record historique`, vc: '#fde68a' } : null,
    jamais.length > 0 ? { k: 'K', bg: '#7f1d1d', nom: 'JAMAIS à cet écart',
      val: `N°${jamais.join(', ')}`, vc: '#fca5a5' } : null,
  ].filter(Boolean) as { k: string; bg: string; nom: string; val: string; vc: string }[];

  return (
    <div>
      <div style={{ ...card, textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '56px', fontWeight: 500, color: '#FFD700', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: '12px', color: '#90b4d4', marginTop: '4px' }}>
          Score de cohérence / 100
        </div>
        {badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px',
            justifyContent: 'center', marginTop: '10px' }}>
            {badges.map((b, i) => (
              <span key={i} style={{ fontSize: '11px', fontWeight: 'bold',
                padding: '3px 10px', borderRadius: '20px',
                background: b.bg, color: b.color, border: b.border }}>
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {convergences.length > 0 && (
        <>
          <div style={secHead}>Convergences détectées</div>
          {convergences.map((c, i) => (
            <div key={i} style={row}>
              <div style={key(c.bg)}>{c.k}</div>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: '#dbeafe' }}>
                {c.nom}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: c.vc }}>
                {c.val}
              </span>
            </div>
          ))}
        </>
      )}
      {convergences.length === 0 && (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '1rem' }}>
          Aucune convergence détectée.
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET GÈNES
// ----------------------------------------------------------------
function OngletGenes({ data, balls }: { data: BouloscopeData; balls: number[] }) {
  const meilleur = balls.reduce((best, n) => {
    return (data.genes[n]?.scoreSelection ?? 0) > (data.genes[best]?.scoreSelection ?? 0)
      ? n : best;
  }, balls[0]);

  const tempColor: Record<string, string> = {
    'brûlant': '#fca5a5', 'chaud': '#fdba74',
    'normal': '#94a3b8', 'froid': '#93c5fd', 'glacé': '#c4b5fd',
  };

  const g = data.genes[meilleur];

  return (
    <div>
      <div style={secHead}>Température des 5 numéros</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
        gap: '6px', marginBottom: '14px' }}>
        {balls.map(n => {
          const gn = data.genes[n];
          const isTop = n === meilleur && (gn?.scoreSelection ?? 0) > 0;
          return (
            <div key={n} style={{ ...card, padding: '8px 4px', textAlign: 'center',
              marginBottom: 0,
              border: isTop ? '1px solid #fca5a5' : '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ fontSize: '16px', fontWeight: 500,
                color: isTop ? '#fca5a5' : '#fff' }}>{n}</div>
              <div style={{ fontSize: '10px', marginTop: '3px',
                color: tempColor[gn?.temperature ?? 'normal'] }}>
                {isTop && (gn?.scoreSelection ?? 0) > 2 ? 'Exceptionnel' : gn?.temperature}
              </div>
              <div style={{ fontSize: '10px', color: '#90b4d4' }}>
                éc. {gn?.ecartActuel ?? '?'}
                {isTop && (gn?.scoreSelection ?? 0) > 2 ? ' ★' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {g && (
        <>
          <div style={secHead}>
            Gènes dynamiques — N°{meilleur}
            {(g.scoreSelection ?? 0) > 2 ? ' (Exceptionnel)' : ''}
          </div>
          {[
            { k: 'H', bg: '#10b981', nom: 'FAVORIT',
              actif: g.signalFavorit,
              val: `Actif — écart ${g.favoritEcart} modal (${g.nbFoisFavorit}×)`,
              vi: `Écart modal : ${g.favoritEcart} (${g.nbFoisFavorit}×)` },
            { k: 'I', bg: '#8b5cf6', nom: 'En FORME',
              actif: g.enForme,
              val: 'Oui — fréquence récente ≥ 2',
              vi: 'Non' },
            { k: 'J', bg: '#ef4444', nom: 'Retard MT',
              actif: g.enRetardMoyTheo,
              val: `Ratio ${g.ratioRetard.toFixed(2)}× — fort !`,
              vi: `Ratio ${g.ratioRetard.toFixed(2)}×` },
            { k: 'G', bg: '#3b82f6', nom: 'Annoncé A(+)',
              actif: g.estAnnoncePlus,
              val: `${g.nbVotesPlus} vote(s) — par ${g.annonceursPrincipaux.join(', ')}`,
              vi: 'Aucun vote' },
            { k: 'K', bg: '#7f1d1d', nom: 'JAMAIS à cet écart',
              actif: g.jamaisAcetEcart,
              val: `Éc. ${g.ecartActuel} — territoire vierge !`,
              vi: `Revenu ${g.nbFoisReelAcetEcart}× à cet écart` },
          ].map(({ k, bg, nom, actif, val, vi }) => (
            <div key={k} style={row}>
              <div style={key(bg)}>{k}</div>
              <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>{nom}</span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace',
                color: actif ? '#fca5a5' : '#64748b',
                fontWeight: actif ? 'bold' : 'normal' }}>
                {actif ? val : vi}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET MARATHON
// ----------------------------------------------------------------
function OngletMarathon({ balls, stars, tirages, source }: {
  balls: number[]; stars: number[]; tirages: number[][]; source: string;
}) {
  const grille = useMemo(() => calculerMarathon(balls, stars, tirages), []);

  const PHENIX = [4, 30, 31, 38, 42];
  const sorted = [...balls].sort((a, b) => a - b);
  const estPhenix = PHENIX.every((n, i) => n === sorted[i]);
  const max5 = grille[5].reduce((s, v) => s + v, 0);

  const classification = estPhenix ? '🔥 Phénix' : max5 > 0 ? 'Cygne Blanc' : 'Cygne Noir';
  const classifDesc = estPhenix
    ? 'Sortie 2× en 22 ans ! Jamais deux sans trois ?'
    : max5 > 0
    ? 'Déjà sortie exactement en 1936 tirages'
    : `Jamais sortie exactement en ${tirages.length} tirages · Via ${source}`;

  return (
    <div>
      <div style={{ ...card, textAlign: 'center', marginBottom: '12px',
        border: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
          {classification}
        </div>
        <div style={{ fontSize: '12px', color: '#90b4d4' }}>{classifDesc}</div>
      </div>

      <div style={secHead}>Le Marathon — Parcours du combattant sur {tirages.length} tirages</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: '8px', marginBottom: '12px' }}>
        {[5,4,3,2,1,0].map(nb => {
          const total = grille[nb].reduce((s, v) => s + v, 0);
          const titre = nb > 1 ? `${nb} numéros` : nb === 1 ? '1 numéro' : '0 numéro';
          return (
            <div key={nb} style={{ ...card, marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 500,
                textTransform: 'uppercase',
                color: total > 0 ? '#FFD700' : '#90b4d4',
                marginBottom: '6px', textAlign: 'center' }}>{titre}</div>
              {[2,1,0].map(ns => (
                <div key={ns} style={{ display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px', color: '#90b4d4', marginBottom: '2px' }}>
                  <span>{nb}+{ns}</span>
                  <span style={{ fontWeight: 500,
                    color: grille[nb][ns] > 0 ? '#fff' : '#90b4d4' }}>
                    {grille[nb][ns]}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: '6px', paddingTop: '6px',
                borderTop: nb === 0 ? '1px solid rgba(239,68,68,.4)' : '1px solid rgba(255,255,255,.1)',
                textAlign: 'center', fontSize: '14px', fontWeight: 500,
                color: nb === 0 ? '#f87171' : total > 0 ? '#FFD700' : '#90b4d4' }}>
                {total}
              </div>
            </div>
          );
        })}
      </div>

      <div style={secHead}>Sous-combinaisons remarquables</div>
      {[
        { k: 'Q', bg: '#d97706', nom: 'Meilleur quadruplet', val: 'À venir...' },
        { k: 'T', bg: '#3b82f6', nom: 'Meilleur triplet',    val: 'À venir...' },
        { k: 'C', bg: '#10b981', nom: 'Couplet le plus fréquent', val: 'À venir...' },
      ].map(({ k, bg, nom, val }) => (
        <div key={k} style={row}>
          <div style={key(bg)}>{k}</div>
          <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>{nom}</span>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#90b4d4' }}>{val}</span>
        </div>
      ))}
      <div style={{ ...row,
        background: estPhenix ? 'rgba(239,68,68,.15)' : '#1e3a5f',
        border: estPhenix ? '0.5px solid rgba(239,68,68,.3)' : 'none' }}>
        <div style={key('#7f1d1d')}>P</div>
        <span style={{ flex: 1, fontSize: '12px', color: estPhenix ? '#fca5a5' : '#dbeafe' }}>
          Phénix
        </span>
        <span style={{ fontSize: '11px', fontFamily: 'monospace',
          color: estPhenix ? '#fca5a5' : '#90b4d4' }}>
          {estPhenix ? 'DÉTECTÉ ! Jamais deux sans trois ?' : 'Non détecté ici'}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET TAMIS
// ----------------------------------------------------------------
function OngletTamis({ data, balls }: { data: BouloscopeData; balls: number[] }) {
  const doublons = balls.filter(n => data.doublons.includes(n));
  const tripleA  = balls.filter(n => data.tripleA.includes(n));
  const tripleB  = balls.filter(n => data.tripleB.includes(n));
  const jamais   = balls.filter(n => data.genes[n]?.jamaisAcetEcart);
  const cascades = balls.filter(n => data.genes[n]?.cascadeActive);
  const streaks  = balls.filter(n => data.genes[n]?.enStreakDanger);

  const dot = (c: string): React.CSSProperties => ({
    width: '8px', height: '8px', borderRadius: '50%',
    background: c, flexShrink: 0,
  });

  const lignes = [
    { nom: 'Triple A — Retard MT',    val: tripleA.length  > 0 ? tripleA.join(', ')  : 'aucun', c: tripleA.length  > 0 ? '#fca5a5' : '#475569' },
    { nom: 'Triple B — Annoncé A(+)', val: tripleB.length  > 0 ? tripleB.join(', ')  : 'aucun', c: tripleB.length  > 0 ? '#fca5a5' : '#475569' },
    { nom: 'Doublon FAVORIT/FORME',   val: doublons.length > 0 ? doublons.join(', ') : 'aucun', c: doublons.length > 0 ? '#86efac' : '#475569' },
    { nom: 'Profil dizaines',         val: data.profilDizaines.join('-'),                        c: '#fde68a' },
    { nom: `G3 à ${data.pctG3}%`,     val: data.signalG3 ? 'Record !' : 'Normal',               c: data.signalG3 ? '#fde68a' : '#86efac' },
    { nom: 'Cascade voisins',         val: cascades.length > 0 ? `N°${cascades.join(', ')}` : 'aucune', c: cascades.length > 0 ? '#86efac' : '#475569' },
    { nom: 'Règle A — Streak',        val: streaks.length  > 0 ? `N°${streaks.join(', ')}` : 'aucun', c: streaks.length  > 0 ? '#fca5a5' : '#86efac' },
    { nom: 'JAMAIS à cet écart',      val: jamais.length   > 0 ? `N°${jamais.join(', ')}` : 'aucun', c: jamais.length   > 0 ? '#fca5a5' : '#475569' },
  ];

  return (
    <div>
      <div style={secHead}>Filtres Tamis Mougeot</div>
      {lignes.map(({ nom, val, c }, i) => (
        <div key={i} style={row}>
          <div style={dot(c)} />
          <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>{nom}</span>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#90b4d4' }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET BPG
// ----------------------------------------------------------------
function OngletBPG({ balls }: { balls: number[] }) {
  const bpgInfo = useMemo(() => {
    try { return getBpgPartenaires(balls); }
    catch { return null; }
  }, []);

  return (
    <div>
      {bpgInfo ? (
        <>
          <div style={card}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[
                { lbl: 'Bassin', val: bpgInfo.bassin },
                { lbl: 'Puits',  val: bpgInfo.puits  },
                { lbl: 'Galerie',val: bpgInfo.galerie },
              ].map(({ lbl, val }) => (
                <div key={lbl} style={{ flex: 1, textAlign: 'center',
                  background: 'rgba(0,0,0,.2)', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#90b4d4',
                    textTransform: 'uppercase', marginBottom: '2px' }}>{lbl}</div>
                  <div style={{ fontSize: '20px', fontWeight: 500, color: '#FFD700' }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#90b4d4' }}>
              Partenaires structurels :{' '}
              <strong style={{ color: '#FFD700' }}>
                {bpgInfo.partenaires.length > 0 ? bpgInfo.partenaires.join(' · ') : 'aucun'}
              </strong>
            </div>
          </div>
          <div style={secHead}>Signaux BPG</div>
          {bpgInfo.partenaires.length > 0 && (
            <div style={row}>
              <div style={key('#10b981')}>P</div>
              <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>Partenaires structurels</span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#86efac' }}>
                {bpgInfo.partenaires.join(' + ')} présents
              </span>
            </div>
          )}
          <div style={row}>
            <div style={key('#3b82f6')}>G</div>
            <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>Galerie</span>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#90b4d4' }}>
              {bpgInfo.bassin}-{bpgInfo.puits}-{bpgInfo.galerie}
            </span>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '1rem' }}>
          Données BPG en cours de chargement...
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// COMPOSANT PRINCIPAL
// ----------------------------------------------------------------
export function BouloscopeModal({ data, balls, stars, tirages, source, onClose }: Props) {
  const [onglet, setOnglet] = useState<Onglet>('score');

  const onglets: { id: Onglet; label: string }[] = [
    { id: 'score',    label: 'Score ADN' },
    { id: 'genes',    label: 'Gènes' },
    { id: 'marathon', label: 'Marathon' },
    { id: 'tamis',    label: 'Tamis' },
    { id: 'bpg',      label: 'BPG' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '460px', margin: '0 1rem',
        background: '#f8fafc', borderRadius: '16px',
        overflow: 'hidden', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,.5)',
      }} onClick={e => e.stopPropagation()}>

        {/* EN-TÊTE BLANC */}
        <div style={{ padding: '16px', textAlign: 'center',
          borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#0f172a' }}>
            Bouloscope
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Analyse complète de votre combinaison
          </div>
        </div>

        {/* BANDEAU BLEU */}
        <div style={{ background: '#1e3a5f', padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase',
            letterSpacing: '.06em', color: '#90b4d4',
            marginBottom: '10px', textAlign: 'center' }}>
            Votre combinaison {source}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center',
            gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
            {balls.map(n => (
              <div key={n} style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: '#2196F3', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 500,
              }}>{n}</div>
            ))}
            <div style={{ width: '1px', height: '26px',
              background: 'rgba(255,255,255,.2)' }} />
            {stars.map(n => (
              <div key={n} style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: '#c47c00', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 500,
              }}>{n}</div>
            ))}
          </div>
        </div>

        {/* ONGLETS */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0',
          background: '#f1f5f9' }}>
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)} style={{
              flex: 1, padding: '10px 4px', fontSize: '11px',
              fontWeight: onglet === o.id ? 600 : 500,
              textAlign: 'center', cursor: 'pointer', border: 'none',
              borderBottom: onglet === o.id ? '2px solid #1e3a5f' : '2px solid transparent',
              background: onglet === o.id ? '#fff' : 'transparent',
              color: onglet === o.id ? '#1e3a5f' : '#64748b',
              transition: 'all .15s',
            }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* CONTENU */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px',
          background: '#f8fafc' }}>
          {onglet === 'score'    && <OngletScore    data={data} balls={balls} />}
          {onglet === 'genes'    && <OngletGenes    data={data} balls={balls} />}
          {onglet === 'marathon' && <OngletMarathon balls={balls} stars={stars}
            tirages={tirages} source={source} />}
          {onglet === 'tamis'    && <OngletTamis    data={data} balls={balls} />}
          {onglet === 'bpg'      && <OngletBPG      balls={balls} />}
        </div>

        {/* PIED */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid #e2e8f0',
          textAlign: 'center', fontSize: '10px', color: '#94a3b8',
          background: '#fff' }}>
          Outil d'observation statistique · Pas de prédiction · Le hasard reste maître
        </div>
      </div>
    </div>
  );
}