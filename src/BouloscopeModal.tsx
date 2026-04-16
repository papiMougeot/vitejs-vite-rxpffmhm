// ================================================================
// BouloscopeModal.tsx — Le Microscope des Boules
// Philosophie : observer l'état du terrain, pas prédire
// PapiMougeotIA · Avril 2026
// ================================================================

import React, { useState } from 'react';
import { BouloscopeData } from './modules/adn-engine';
import { ACCES, MSG_PREMIUM } from './licence';

// ----------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------
type Onglet = 'score' | 'genes' | 'marathon' | 'tamis' | 'bpg';

interface Props {
  data: BouloscopeData;
  balls: number[];
  stars: number[];
  onClose: () => void;
}

// ----------------------------------------------------------------
// COMPOSANTS UTILITAIRES
// ----------------------------------------------------------------

function Boule({ n, isStar = false }: { n: number; isStar?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 'bold',
        background: isStar
          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
          : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
        color: isStar ? '#fff' : '#1e293b',
        border: isStar ? '1px solid #b45309' : '1px solid #94a3b8',
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}

function Badge({
  label,
  couleur,
}: {
  label: string;
  couleur: 'rouge' | 'orange' | 'vert' | 'bleu' | 'gris';
}) {
  const styles: Record<string, React.CSSProperties> = {
    rouge:  { background: 'rgba(239,68,68,.2)',   color: '#fca5a5', border: '1px solid rgba(239,68,68,.4)' },
    orange: { background: 'rgba(234,179,8,.2)',   color: '#fde68a', border: '1px solid rgba(234,179,8,.4)' },
    vert:   { background: 'rgba(34,197,94,.2)',   color: '#86efac', border: '1px solid rgba(34,197,94,.4)' },
    bleu:   { background: 'rgba(59,130,246,.2)',  color: '#93c5fd', border: '1px solid rgba(59,130,246,.4)' },
    gris:   { background: 'rgba(100,116,139,.2)', color: '#94a3b8', border: '1px solid rgba(100,116,139,.4)' },
  };
  return (
    <span style={{
      ...styles[couleur],
      fontSize: '10px', fontWeight: 'bold', padding: '2px 8px',
      borderRadius: '20px', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function LigneTamis({
  label, valeur, statut,
}: {
  label: string; valeur: string; statut: 'vert' | 'orange' | 'rouge';
}) {
  const couleurs = {
    vert:   '#86efac',
    orange: '#fde68a',
    rouge:  '#fca5a5',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 10px', background: 'rgba(15,23,42,.6)',
      borderRadius: '6px', marginBottom: '4px',
    }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: couleurs[statut], flexShrink: 0,
      }} />
      <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>{label}</span>
      <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{valeur}</span>
    </div>
  );
}

function PremiumLock() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', gap: '12px',
      background: 'rgba(15,23,42,.8)', borderRadius: '12px',
      border: '1px dashed rgba(234,179,8,.4)',
    }}>
      <span style={{ fontSize: '32px' }}>🔒</span>
      <p style={{ fontSize: '13px', color: '#fde68a', textAlign: 'center', margin: 0 }}>
        {MSG_PREMIUM}
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET : SCORE ADN
// ----------------------------------------------------------------
function OngletScore({ data }: { data: BouloscopeData }) {
  const score = Math.min(100, Math.round(
    (data.doublons.length * 15) +
    (data.tripleA.length * 20) +
    (data.tripleB.length * 20) +
    (data.jamais.length * 10) +
    (data.signalG3 ? 15 : 0)
  ));

  const convergences = [];
  if (data.tripleA.length > 0)
    convergences.push({ label: `Triple A — N°${data.tripleA.join(', ')}`, couleur: 'rouge' as const });
  if (data.tripleB.length > 0)
    convergences.push({ label: `Triple B — N°${data.tripleB.join(', ')}`, couleur: 'rouge' as const });
  if (data.doublons.length > 0)
    convergences.push({ label: `Doublon(s) — N°${data.doublons.join(', ')}`, couleur: 'orange' as const });
  if (data.jamais.length > 0)
    convergences.push({ label: `JAMAIS — N°${data.jamais.join(', ')}`, couleur: 'bleu' as const });
  if (data.signalG3)
    convergences.push({ label: `Signal G3 — ${data.pctG3}% froids`, couleur: 'orange' as const });

  return (
    <div>
      {/* Score hero */}
      <div style={{
        textAlign: 'center', padding: '16px',
        background: 'rgba(15,23,42,.8)', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,.1)', marginBottom: '12px',
      }}>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFD700' }}>{score}</div>
        <div style={{ fontSize: '12px', color: '#90b4d4', marginTop: '4px' }}>
          Score de cohérence du terrain / 100
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '10px' }}>
          {data.doublons.map(n => <Badge key={n} label={`Doublon N°${n}`} couleur="orange" />)}
          {data.tripleA.map(n => <Badge key={n} label={`Triple A N°${n}`} couleur="rouge" />)}
          {data.tripleB.map(n => <Badge key={n} label={`Triple B N°${n}`} couleur="rouge" />)}
        </div>
      </div>

      {/* Convergences */}
      {convergences.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
            letterSpacing: '.05em', color: '#64748b', marginBottom: '8px' }}>
            Convergences détectées
          </div>
          {convergences.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 10px', background: 'rgba(15,23,42,.6)',
              borderRadius: '6px', marginBottom: '4px',
            }}>
              <Badge label={c.label} couleur={c.couleur} />
            </div>
          ))}
        </div>
      )}

      {convergences.length === 0 && (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '1rem' }}>
          Aucune convergence détectée pour cette combinaison.
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET : GÈNES
// ----------------------------------------------------------------
function OngletGenes({ data, balls }: { data: BouloscopeData; balls: number[] }) {
  if (!ACCES.ongletGenes) return <PremiumLock />;

  // Numéro avec meilleur score
  const meilleur = balls.reduce((best, n) => {
    const g = data.genes[n];
    const prev = data.genes[best];
    return g && prev && g.scoreSelection > prev.scoreSelection ? n : best;
  }, balls[0]);

  return (
    <div>
      {/* Température des 5 numéros */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
          letterSpacing: '.05em', color: '#64748b', marginBottom: '8px' }}>
          Température
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px' }}>
          {balls.map(n => {
            const g = data.genes[n];
            if (!g) return null;
            const tempColor = {
              'brûlant': '#fca5a5', 'chaud': '#fdba74',
              'normal': '#94a3b8', 'froid': '#93c5fd', 'glacé': '#c4b5fd',
            }[g.temperature] || '#94a3b8';
            return (
              <div key={n} style={{
                background: 'rgba(15,23,42,.8)', borderRadius: '8px',
                padding: '8px 4px', textAlign: 'center',
                border: n === meilleur ? '1px solid #fca5a5' : '1px solid rgba(255,255,255,.1)',
              }}>
                <div style={{ fontSize: '16px', fontWeight: '500', color: n === meilleur ? '#fca5a5' : '#fff' }}>
                  {n}
                </div>
                <div style={{ fontSize: '10px', color: tempColor, marginTop: '3px' }}>
                  {g.temperature}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>éc. {g.ecartActuel}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gènes du meilleur numéro */}
      {meilleur && data.genes[meilleur] && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
            letterSpacing: '.05em', color: '#64748b', marginBottom: '8px' }}>
            Gènes dynamiques — N°{meilleur}
          </div>
          {[
            { lettre: 'H', nom: 'FAVORIT', actif: data.genes[meilleur].signalFavorit,
              val: `éc. ${data.genes[meilleur].favoritEcart} modal (${data.genes[meilleur].nbFoisFavorit}×)` },
            { lettre: 'I', nom: 'En FORME', actif: data.genes[meilleur].enForme,
              val: `${data.genes[meilleur].nbSorties} sorties` },
            { lettre: 'J', nom: 'Retard MT', actif: data.genes[meilleur].enRetardMoyTheo,
              val: `ratio ${data.genes[meilleur].ratioRetard.toFixed(2)}×` },
            { lettre: 'G', nom: 'Annoncé A(+)', actif: data.genes[meilleur].estAnnoncePlus,
              val: `${data.genes[meilleur].nbVotesPlus} vote(s)` },
            { lettre: 'K', nom: 'JAMAIS à cet écart', actif: data.genes[meilleur].jamaisAcetEcart,
              val: `éc. ${data.genes[meilleur].ecartActuel} vierge` },
          ].map(({ lettre, nom, actif, val }) => (
            <div key={lettre} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 10px', background: 'rgba(15,23,42,.6)',
              borderRadius: '6px', marginBottom: '4px',
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: actif ? '#ef4444' : '#334155',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: '700', color: '#fff',
              }}>{lettre}</div>
              <span style={{ flex: 1, fontSize: '12px', color: '#dbeafe' }}>{nom}</span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace',
                color: actif ? '#fca5a5' : '#64748b', fontWeight: actif ? '600' : '400' }}>
                {actif ? val : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET : MARATHON
// ----------------------------------------------------------------
function OngletMarathon(_props: { balls: number[]; stars: number[] }) {
    // Détection Phénix
  const PHENIX = [4, 30, 31, 38, 42];
  const sorted = [...balls].sort((a, b) => a - b);
  const estPhenix = PHENIX.every((n, i) => n === sorted[i]);

  return (
    <div>
      {/* Classification Cygne */}
      <div style={{
        textAlign: 'center', padding: '12px',
        background: 'rgba(15,23,42,.8)', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,.1)', marginBottom: '12px',
      }}>
        <div style={{ fontSize: '16px', fontWeight: '500', color: '#fff', marginBottom: '4px' }}>
          {estPhenix ? '🔥 Phénix' : 'Cygne Noir'}
        </div>
        <div style={{ fontSize: '12px', color: '#90b4d4' }}>
          {estPhenix
            ? 'Cette combinaison est sortie 2× en 22 ans ! Jamais deux sans trois ?'
            : 'Combinaison jamais sortie exactement en 1936 tirages'}
        </div>
      </div>

      {/* Pavés Marathon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { titre: '5 numéros', rows: ['5+2','5+1','5+0'] },
          { titre: '4 numéros', rows: ['4+2','4+1','4+0'] },
          { titre: '3 numéros', rows: ['3+2','3+1','3+0'] },
          { titre: '2 numéros', rows: ['2+2','2+1','2+0'] },
          { titre: '1 numéro',  rows: ['1+2','1+1','1+0'] },
          { titre: '0 numéro',  rows: ['0+2','0+1','0+0'] },
        ].map(({ titre, rows }, i) => (
          <div key={i} style={{
            background: 'rgba(30,58,95,.8)', borderRadius: '8px',
            padding: '8px', border: '1px solid rgba(255,255,255,.1)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
              color: '#90b4d4', marginBottom: '6px', textAlign: 'center' }}>
              {titre}
            </div>
            {rows.map(r => (
              <div key={r} style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                <span>{r}</span>
                <span style={{ color: '#94a3b8' }}>—</span>
              </div>
            ))}
            <div style={{ marginTop: '6px', paddingTop: '6px',
              borderTop: i === 5 ? '1px solid rgba(239,68,68,.4)' : '1px solid rgba(255,255,255,.1)',
              textAlign: 'center', fontSize: '14px', fontWeight: '500',
              color: i === 5 ? '#fca5a5' : '#FFD700' }}>
              —
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center', fontStyle: 'italic' }}>
        Le calcul Marathon complet sera disponible prochainement.
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET : TAMIS
// ----------------------------------------------------------------
function OngletTamis({ data, balls }: { data: BouloscopeData; balls: number[] }) {
  if (!ACCES.ongletTamis) return <PremiumLock />;

  const doublonsPresents = balls.filter(n => data.doublons.includes(n));
  const tripleAPresents  = balls.filter(n => data.tripleA.includes(n));
  const tripleBPresents  = balls.filter(n => data.tripleB.includes(n));
  const jamaisPresents   = balls.filter(n => data.jamais.includes(n));

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
        letterSpacing: '.05em', color: '#64748b', marginBottom: '8px' }}>
        Filtres Tamis Mougeot
      </div>
      <LigneTamis label="Doublon FAVORIT/FORME"
        valeur={doublonsPresents.length > 0 ? doublonsPresents.join(', ') : 'aucun'}
        statut={doublonsPresents.length > 0 ? 'vert' : 'gris' as any} />
      <LigneTamis label="Triple A — Retard MT"
        valeur={tripleAPresents.length > 0 ? tripleAPresents.join(', ') : 'aucun'}
        statut={tripleAPresents.length > 0 ? 'rouge' : 'gris' as any} />
      <LigneTamis label="Triple B — Annoncé A(+)"
        valeur={tripleBPresents.length > 0 ? tripleBPresents.join(', ') : 'aucun'}
        statut={tripleBPresents.length > 0 ? 'rouge' : 'gris' as any} />
      <LigneTamis label="JAMAIS à cet écart"
        valeur={jamaisPresents.length > 0 ? jamaisPresents.join(', ') : 'aucun'}
        statut={jamaisPresents.length > 0 ? 'orange' : 'gris' as any} />
      <LigneTamis label="Signal G3"
        valeur={data.signalG3 ? `${data.pctG3}% — record !` : `${data.pctG3}% — normal`}
        statut={data.signalG3 ? 'orange' : 'vert'} />
    </div>
  );
}

// ----------------------------------------------------------------
// ONGLET : BPG
// ----------------------------------------------------------------
function OngletBPG(_props: { balls: number[] }) {
    if (!ACCES.ongletBPG) return <PremiumLock />;

  return (
    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '1rem' }}>
      <p>L'analyse BPG complète sera intégrée prochainement.</p>
      <p style={{ marginTop: '8px', fontSize: '11px' }}>
        Bassins · Puits · Galeries — 1960 galeries cartographiées
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// COMPOSANT PRINCIPAL
// ----------------------------------------------------------------
export function BouloscopeModal({ data, balls, stars, onClose }: Props) {
  const [onglet, setOnglet] = useState<Onglet>('score');

  const onglets: { id: Onglet; label: string }[] = [
    { id: 'score',   label: 'Score ADN' },
    { id: 'genes',   label: 'Gènes' },
    { id: 'marathon',label: 'Marathon' },
    { id: 'tamis',   label: 'Tamis' },
    { id: 'bpg',     label: 'BPG' },
  ];

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '440px', margin: '0 1rem',
          background: '#0f172a', border: '2px solid #1e3a5f',
          borderRadius: '16px', overflow: 'hidden',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div style={{
          background: '#1e3a5f', padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,.1)',
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#fff' }}>
              🔬 Bouloscope
            </div>
            <div style={{ fontSize: '11px', color: '#90b4d4', marginTop: '2px' }}>
              Microscope des boules — état du terrain
            </div>
          </div>
          {/* Combinaison */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {balls.map(n => <Boule key={n} n={n} />)}
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,.2)', margin: '0 2px' }} />
            {stars.map(n => <Boule key={n} n={n} isStar />)}
          </div>
        </div>

        {/* Onglets */}
        <div style={{
          display: 'flex', borderBottom: '1px solid rgba(255,255,255,.1)',
        }}>
          {onglets.map(o => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              style={{
                flex: 1, padding: '8px 4px', fontSize: '10px', fontWeight: '500',
                textAlign: 'center', cursor: 'pointer', border: 'none',
                borderBottom: onglet === o.id ? '2px solid #3b82f6' : '2px solid transparent',
                background: onglet === o.id ? 'rgba(59,130,246,.15)' : 'transparent',
                color: onglet === o.id ? '#93c5fd' : '#64748b',
                transition: 'all .15s',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
          {onglet === 'score'    && <OngletScore data={data} />}
          {onglet === 'genes'    && <OngletGenes data={data} balls={balls} />}
          {onglet === 'marathon' && <OngletMarathon balls={balls} stars={stars} />}
          {onglet === 'tamis'    && <OngletTamis data={data} balls={balls} />}
          {onglet === 'bpg'      && <OngletBPG balls={balls} />}
        </div>

        {/* Pied */}
        <div style={{
          padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,.1)',
          textAlign: 'center', fontSize: '10px', color: '#334155',
        }}>
          Outil d'observation statistique · Pas de prédiction · Le hasard reste maître
        </div>
      </div>
    </div>
  );
}