import React, { useState, useEffect, useRef } from 'react';
// IMPORT DE LA BIBLIOTHÈQUE DE DONNÉES
import { LE_CODEX } from './boulotron-data';
// IMPORT DE L'EXPERT LUNAIRE (Le Cerveau)
import { obtenirPhaseLunaire, PhaseLune } from './lune';

// On importe les données, mais on les renomme "INFOS" juste pour ce fichier
import { INFOS_TIRAGE as INFOS } from './dernierTirage';

// ======================================================================
// 2. OUTILS & ICONES
//=====================================================================
function SettingsIcon({ size = 18, className = '' }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function BookIcon({ size = 24, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function CloseIcon({ size = 24, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function CheckIcon({ size = 16, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function BanIcon({ size = 16, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>
  );
}

function VolumeIcon({
  size = 24,
  className = '',
  style = {},
}: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, width: size, height: size }}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function MuteIcon({
  size = 24,
   className = '',
  style = {},
}: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, width: size, height: size }}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function HandIcon({
  size = 64,
   className = '',
  style = {},
}: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, width: size, height: size }}
    >
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}
function PrinterIcon({ size = 20, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
function DownloadIcon({ size = 20, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function FunnelIcon({ size = 32, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function SphereIcon({ size = 32, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
function TrashIcon({ size = 20, className = '' }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function PapiAvatar() {
  return (
    <div className="papi-container">
      <img
        src="https://i.ibb.co/nNs0V3PS/Papito.png"
        alt="Papi Mougeot"
        className="papi-image"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

// --- BOULOSCOPE ---
// function DecadeBouloscope({ balls }: { balls: number[] }) {
//   const dist = [0, 0, 0, 0, 0];
//   balls.forEach((n) => {
//     const dIndex = Math.ceil(n / 10) - 1;
//     if (dIndex >= 0 && dIndex < 5) dist[dIndex]++;
//   });

//   // 1. On identifie les dizaines qui contiennent au moins une boule
//   const indicesSortis = dist
//     .map((count, i) => (count > 0 ? i + 1 : null))
//     .filter((v) => v !== null);

//   // 2. On vérifie si une dizaine a fait le "Grand Chelem" (les 5 boules)
//   const grandChelemIndex = dist.findIndex((count) => count === 5);

//   // 3. Préparation du libellé visuel
//   let libelle = "";
//   if (grandChelemIndex !== -1) {
//     libelle = `Tous les numéros sont sortis dizaine : ${grandChelemIndex + 1}`;
//   } else {
//     libelle = `Dizaines sorties : ${indicesSortis.join("")}`;
//   }

//   return (
//     <div className="w-full mt-2 bg-slate-900/50 rounded p-2 border border-slate-700/50">
//       {/* Les barres de progression visuelles */}
//       <div className="flex justify-between items-end gap-1 h-12 px-2 mb-2">
//         {dist.map((count, i) => (
//           <div key={i} className="flex flex-col items-center justify-end h-full w-1/5">
//             <div className={`mb-1 text-[9px] font-bold ${count > 0 ? 'text-cyan-400' : 'text-slate-600'}`}>
//               {count > 0 ? `${count}b` : ""}
//             </div>
//             <div className="w-full bg-slate-800 rounded-t-sm relative overflow-hidden" style={{ height: '60%' }}>
//               <div
//                 className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${
//                   count === 5 ? 'bg-yellow-400 shadow-[0_0_10px_gold]' : 'bg-cyan-600'
//                 }`}
//                 style={{ height: `${count * 20}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Le nouveau libellé dynamique */}
//       <div className="flex justify-center items-center pt-2 border-t border-slate-700/50">
//         <div className={`text-[10px] font-bold font-mono tracking-wider px-2 py-1 rounded border ${
//           grandChelemIndex !== -1 
//             ? 'bg-yellow-900/30 border-yellow-500 text-yellow-400 animate-pulse' 
//             : 'bg-slate-950 border-cyan-900/50 text-cyan-400'
//         }`}>
//           {libelle}
//         </div>
//       </div>
//     </div>
//   );
// }

// --- LECTEUR DE CODEX (MODALE) ---
function CodexReader({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: (nums: number[], stars: number[]) => void;
}) {
  const chap = LE_CODEX.lunaire;
  return (
    <div
      className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border-4 border-yellow-600 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-yellow-700/20 border-b border-yellow-600/50 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <span className="text-3xl">{chap.icone}</span> {chap.titre}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <CloseIcon size={28} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-300 space-y-4 font-serif text-lg leading-relaxed">
          {chap.contenu.map((bloc, i) => {
            if (bloc.type === 'titre')
              return (
                <h3
                  key={i}
                  className="text-xl font-bold text-cyan-400 mt-4 border-b border-cyan-900 pb-1"
                >
                  {bloc.text}
                </h3>
              );
            if (bloc.type === 'info')
              return (
                <div
                  key={i}
                  className="bg-slate-800 p-3 rounded border-l-4 border-yellow-500 text-sm italic text-yellow-200"
                >
                  {bloc.text}
                </div>
              );
            return <p key={i}>{bloc.text}</p>;
          })}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-950/50 flex justify-center">
          <button
            onClick={() => onApply(chap.strategie.nums, chap.strategie.stars)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <CheckIcon /> APPLIQUER LA STRATÉGIE
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TAPIS VOLANT (SÉLECTRON) ---
type DecadeState = 'neutral' | 'required' | 'forbidden';

function TapisVolant({
  onClose,
  onValidate,
  initialNums = [],
  initialStars = [],
}: {
  onClose: () => void;
  onValidate: (balls: number[], stars: number[]) => void;
  initialNums?: number[];
  initialStars?: number[];
}) {
  const [selectedNums, setSelectedNums] = useState<number[]>(initialNums);
  const [forbiddenNums, setForbiddenNums] = useState<number[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>(initialStars);
  const [forbiddenStars, setForbiddenStars] = useState<number[]>([]);
  const [decadeConstraints, setDecadeConstraints] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);
  const [decadeStatus, setDecadeStatus] = useState<DecadeState[]>([
    'neutral',
    'neutral',
    'neutral',
    'neutral',
    'neutral',
  ]);
  const [randomDecadesCount, setRandomDecadesCount] = useState<number>(0);
  const [showRandomMenu, setShowRandomMenu] = useState(false);
  // const [masterStep, setMasterStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialNums.length > 0) {
      const newConstraints = [0, 0, 0, 0, 0];
      const newStatus: DecadeState[] = [
        'neutral',
        'neutral',
        'neutral',
        'neutral',
        'neutral',
      ];
      initialNums.forEach((n) => {
        const d = Math.ceil(n / 10) - 1;
        newConstraints[d]++;
        newStatus[d] = 'required';
      });
      setDecadeConstraints(newConstraints);
      setDecadeStatus(newStatus);
    }
  }, []);

  const toggleNum = (n: number) => {
    const dIndex = Math.ceil(n / 10) - 1;
    const currentCount = decadeConstraints[dIndex];
    const totalConstraints = decadeConstraints.reduce((a, b) => a + b, 0);

    if (selectedNums.includes(n)) {
      setSelectedNums(selectedNums.filter((i) => i !== n));
      setForbiddenNums([...forbiddenNums, n]);
      const newVal = Math.max(0, currentCount - 1);
      const newConstraints = [...decadeConstraints];
      newConstraints[dIndex] = newVal;
      setDecadeConstraints(newConstraints);
      if (newVal === 0) {
        const newStatus = [...decadeStatus];
        newStatus[dIndex] = 'neutral';
        setDecadeStatus(newStatus);
      }
    } else if (forbiddenNums.includes(n)) {
      setForbiddenNums(forbiddenNums.filter((i) => i !== n));
    } else {
      if (totalConstraints >= 5) {
        setErrorMsg('Total max 5 !');
        setTimeout(() => setErrorMsg(null), 2000);
        return;
      }
      if (selectedNums.length >= 5) return;
      setSelectedNums([...selectedNums, n]);
      const newVal = currentCount + 1;
      const newConstraints = [...decadeConstraints];
      newConstraints[dIndex] = newVal;
      setDecadeConstraints(newConstraints);
      const newStatus = [...decadeStatus];
      newStatus[dIndex] = 'required';
      setDecadeStatus(newStatus);
    }
    setErrorMsg(null); // <--- AJOUT
  };

  const toggleStar = (n: number) => {
    if (selectedStars.includes(n)) {
      setSelectedStars(selectedStars.filter((i) => i !== n));
      setForbiddenStars([...forbiddenStars, n]);
    } else if (forbiddenStars.includes(n)) {
      setForbiddenStars(forbiddenStars.filter((i) => i !== n));
    } else {
      if (selectedStars.length < 2) setSelectedStars([...selectedStars, n]);
    }
    setErrorMsg(null); // <--- AJOUT
  };

  const updateConstraint = (dIndex: number, delta: number) => {
    if (decadeStatus[dIndex] === 'forbidden') return;
    const currentVal = decadeConstraints[dIndex];
    let newVal = currentVal + delta;
    if (newVal > 9) newVal = 0;
    if (newVal < 0) newVal = 9;
    const countInDecade = selectedNums.filter(
      (n) => Math.ceil(n / 10) - 1 === dIndex
    ).length;
    if (newVal < countInDecade) {
      setErrorMsg(`Impossible : ${countInDecade} n° cochés !`);
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }
    const totalConstraints =
      decadeConstraints.reduce((a, b) => a + b, 0) - currentVal + newVal;
    if (totalConstraints > 5) {
      setErrorMsg('Total max 5 !');
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }
    if (newVal > 0 && decadeStatus[dIndex] === 'neutral') {
      const newStatus = [...decadeStatus];
      newStatus[dIndex] = 'required';
      setDecadeStatus(newStatus);
    }
    const newConstraints = [...decadeConstraints];
    newConstraints[dIndex] = newVal;
    setDecadeConstraints(newConstraints);
    setErrorMsg(null); // <--- AJOUT
  };

  const toggleDecadeLabel = (dIndex: number) => {
    const current = decadeStatus[dIndex];
    let next: DecadeState = 'neutral';
    if (current === 'neutral') next = 'required';
    else if (current === 'required') next = 'forbidden';
    else next = 'neutral';
    const newStatus = [...decadeStatus];
    newStatus[dIndex] = next;
    setDecadeStatus(newStatus);
    if (next === 'forbidden') {
      const newConstraints = [...decadeConstraints];
      newConstraints[dIndex] = 0;
      setDecadeConstraints(newConstraints);
    }
    setErrorMsg(null); // <--- AJOUT
  };

  // const handleMasterDizaines = () => {
  //   let nextStep = (masterStep + 1) % 3;
  //   setMasterStep(nextStep);
  //   if (nextStep === 1) {
  //     setDecadeConstraints([1, 1, 1, 1, 1]);
  //     setDecadeStatus([
  //       'required',
  //       'required',
  //       'required',
  //       'required',
  //       'required',
  //     ]);
  //   } else if (nextStep === 2) {
  //     setDecadeConstraints([0, 0, 0, 0, 0]);
  //     setDecadeStatus([
  //       'required',
  //       'required',
  //       'required',
  //       'required',
  //       'required',
  //     ]);
  //   } else {
  //     setDecadeConstraints([0, 0, 0, 0, 0]);
  //     setDecadeStatus(['neutral', 'neutral', 'neutral', 'neutral', 'neutral']);
  //   }
  //   setErrorMsg(null); // <--- AJOUT
  // };
  const handleSelectRandomDecades = (count: number) => {
    setRandomDecadesCount(count);
    setShowRandomMenu(false);
    handleReset(); 
    
    if (count === 5) {
      setDecadeConstraints([1, 1, 1, 1, 1]);
      setDecadeStatus(['required', 'required', 'required', 'required', 'required']);
    } else if (count > 0) {
      const indices = [0, 1, 2, 3, 4];
      const shuffled = indices.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      const newStatus: DecadeState[] = ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'];
      selected.forEach(idx => {
        newStatus[idx] = 'required';
      });
      setDecadeStatus(newStatus);
      // setInfoMessage(`Sélectron : ${count} dizaines choisies au hasard !`);
    }
  };
  const handleReset = () => {
    setSelectedNums([]);
    setForbiddenNums([]);
    setSelectedStars([]);
    setForbiddenStars([]);
    setDecadeConstraints([0, 0, 0, 0, 0]);
    setDecadeStatus(['neutral', 'neutral', 'neutral', 'neutral', 'neutral']);
    // setMasterStep(0);
    setErrorMsg(null);
  };

  // ------------------------------------------------------------------------------------------
  // LE CŒUR DU SÉLECTRON - LOGIQUE DE VALIDATION & REMPLISSAGE
  // ------------------------------------------------------------------------------------------
  const handleValidate = () => {
    setErrorMsg(null);
    let finalBalls: number[] = [];
    let finalStars: number[] = [...selectedStars];
    
    // 1. DÉFINITION DU TERRITOIRE (Les zones imposées en VERT)
    const requiredDecades = decadeStatus
      .map((status, index) => (status === 'required' ? index : null))
      .filter((v) => v !== null) as number[];
    const hasGreenZones = requiredDecades.length > 0;

    let success = false;
    let attempts = 0;

    // 2. LA BOUCLE DE SÉCURITÉ (On recommence tant que ce n'est pas parfait)
    while (!success && attempts < 1000) {
      attempts++;
      let tempFinalBalls = [...selectedNums];
      
      // A. Respect des quotas JAUNES (Plafond strict)
      for (let d = 0; d < 5; d++) {
        const target = decadeConstraints[d];
        if (target > 0) {
          let pool = [];
          for (let i = d * 10 + 1; i <= d * 10 + 10; i++) {
            if (!tempFinalBalls.includes(i) && !forbiddenNums.includes(i)) pool.push(i);
          }
          let currentInD = tempFinalBalls.filter(n => Math.ceil(n/10)-1 === d).length;
          let needed = target - currentInD;
          while (needed > 0 && pool.length > 0) {
            const rIdx = Math.floor(Math.random() * pool.length);
            tempFinalBalls.push(pool.splice(rIdx, 1)[0]);
            needed--;
          }
        }
      }

      // B. Remplissage par le HASARD (Uniquement dans les zones VERTES si elles existent)
      if (tempFinalBalls.length < 5) {
        let globalPool = [];
        for (let i = 1; i <= 50; i++) {
          const dIdx = Math.ceil(i / 10) - 1;
          const isZoneAuthorized = hasGreenZones ? decadeStatus[dIdx] === 'required' : decadeStatus[dIdx] !== 'forbidden';
          const isQuotaFull = decadeConstraints[dIdx] > 0 && tempFinalBalls.filter(n => Math.ceil(n/10)-1 === dIdx).length >= decadeConstraints[dIdx];
          
          if (!tempFinalBalls.includes(i) && !forbiddenNums.includes(i) && isZoneAuthorized && !isQuotaFull) {
            globalPool.push(i);
          }
        }
        while (tempFinalBalls.length < 5 && globalPool.length > 0) {
          const rIdx = Math.floor(Math.random() * globalPool.length);
          tempFinalBalls.push(globalPool.splice(rIdx, 1)[0]);
        }
      }

      // C. LE CONTRÔLE TECHNIQUE : Est-ce que chaque zone verte a au moins une boule ?
      const presentDecades = tempFinalBalls.map(n => Math.ceil(n/10)-1);
      const allRequiredPresent = requiredDecades.every(dIdx => presentDecades.includes(dIdx));

      if (allRequiredPresent && tempFinalBalls.length === 5) {
        success = true;
        finalBalls = tempFinalBalls;
      }
    }

    if (!success) {
      setErrorMsg("Combinaison impossible ! Libérez des contraintes.");
      return;
    }

    // 3. ÉTOILES (Logique standard)
    if (finalStars.length < 2) {
      let sPool = [];
      for (let i = 1; i <= 12; i++) {
        if (!finalStars.includes(i) && !forbiddenStars.includes(i)) sPool.push(i);
      }
      while (finalStars.length < 2 && sPool.length > 0) {
        const rIdx = Math.floor(Math.random() * sPool.length);
        finalStars.push(sPool.splice(rIdx, 1)[0]);
      }
    }

    onValidate(finalBalls, finalStars);
  };

  const getButtonLabel = () => {
    if (
      selectedNums.length === 0 &&
      selectedStars.length === 0 &&
      decadeConstraints.every((c) => c === 0)
    )
      return 'FLASH ⚡';
    if (selectedNums.length === 5 && selectedStars.length === 2)
      return 'VALIDER ✅';
    return 'COMPLÉTER 🎲';
  };

  const rowHeightClass = 'h-10';
  const titleHeightClass = 'h-8 mb-4 flex items-center justify-center';

  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-purple-900 to-indigo-900 border-4 border-yellow-500 rounded-xl shadow-2xl p-4 m-2 flex flex-col md:flex-row gap-4 overflow-hidden items-start pt-8 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-transform hover:scale-110 active:scale-95 z-50 bg-transparent"
          title="Fermer"
        >
          <CloseIcon size={32} />
        </button>
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-yellow-400 opacity-50"></div>
        <div className="w-full md:w-1/4 bg-slate-800/50 rounded p-2 border border-slate-600 flex flex-col gap-2 pt-8">
        <div className="relative">
            <div
              onClick={() => setShowRandomMenu(!showRandomMenu)}
              className={`cursor-pointer select-none transition-all active:scale-95 hover:text-white ${titleHeightClass} ${
                randomDecadesCount > 0 ? 'text-green-400 text-shadow-glow' : 'text-yellow-400'
              }`}
            >
              <h3 className="font-bold text-center text-xs uppercase flex items-center gap-2">
                DIZAINES {randomDecadesCount > 0 && (
                  <span className="text-[10px] bg-green-500 text-black px-1 rounded animate-pulse">
                    ALEA {randomDecadesCount}
                  </span>
                )}
              </h3>
            </div>

            {showRandomMenu && (
              <div className="absolute top-full left-0 w-48 bg-slate-900 border-2 border-yellow-500 rounded shadow-2xl z-[110] flex flex-col p-1 animate-in fade-in slide-in-from-top-1">
                <div className="text-[9px] text-slate-500 text-center mb-1 uppercase font-bold border-b border-slate-800 pb-1">
                  Répartir sur :
                </div>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRandomDecades(n);
                    }}
                    className="text-[10px] py-2 hover:bg-yellow-600 hover:text-white rounded transition-colors uppercase font-bold text-slate-200 text-center bg-transparent border-none cursor-pointer"
                  >
                    {n} {n === 1 ? 'Dizaine' : 'Dizaines'}
                  </button>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRandomDecades(0);
                    setShowRandomMenu(false);
                  }}
                  className="text-[10px] py-2 mt-1 border-t border-slate-700 text-red-400 hover:bg-red-900/30 font-bold text-center bg-transparent cursor-pointer"
                >
                  ANNULER
                </button>
              </div>
            )}
          </div>
          {[0, 1, 2, 3, 4].map((d) => (
            <div
              key={d}
              className={`flex justify-between items-center bg-slate-900 p-1 rounded ${rowHeightClass}`}
            >
              <div
                onClick={() => toggleDecadeLabel(d)}
                className={`flex items-center gap-1 cursor-pointer select-none text-xs font-mono px-1 rounded transition-colors ${
                  decadeStatus[d] === 'required'
                    ? 'text-green-400 font-bold bg-green-900/30'
                    : decadeStatus[d] === 'forbidden'
                    ? 'text-red-500 font-bold bg-red-900/30 line-through'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {d * 10 + 1}-{d * 10 + 10}
                {decadeStatus[d] === 'required' && <CheckIcon size={10} />}
                {decadeStatus[d] === 'forbidden' && <BanIcon size={10} />}
              </div>
              <div className="flex gap-1 items-center">
                <button
                  onClick={() => updateConstraint(d, -1)}
                  className={`w-5 h-5 rounded text-xs text-white ${
                    decadeStatus[d] === 'forbidden'
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  -
                </button>
                <span
                  className={`text-sm font-bold w-4 text-center ${
                    decadeConstraints[d] > 0
                      ? 'text-yellow-400'
                      : 'text-slate-500'
                  }`}
                >
                  {decadeConstraints[d] === 0 ? '' : decadeConstraints[d]}
                </span>
                <button
                  onClick={() => updateConstraint(d, 1)}
                  className={`w-5 h-5 rounded text-xs text-white ${
                    decadeStatus[d] === 'forbidden'
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          {errorMsg && (
            <div className="text-red-400 text-[10px] text-center font-bold animate-pulse">
              {errorMsg}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col pt-8">
          <h3
            className={`style-jackpot text-3xl text-yellow-400 tracking-widest ${titleHeightClass}`}
          >
            SÉLECTRON
          </h3>
          <div className="flex flex-col gap-2 mt-2">
            {[0, 1, 2, 3, 4].map((decadeIndex) => (
              <div
                key={decadeIndex}
                className={`grid grid-cols-10 gap-1 items-center ${rowHeightClass}`}
              >
                {Array.from(
                  { length: 10 },
                  (_, i) => decadeIndex * 10 + i + 1
                ).map((n) => {
                  const isSelected = selectedNums.includes(n);
                  const isForbidden = forbiddenNums.includes(n);
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNum(n)}
                      className={`w-full h-full rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-white text-blue-900 scale-110 shadow-[0_0_10px_white]'
                          : isForbidden
                          ? 'bg-red-900/50 text-red-500 border border-red-900'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-[#FFFF00] text-xs sm:text-sm font-bold italic leading-relaxed">
            Posez vos conditions : vos numéros fétiches, vos dizaines.
            <br />
            Le hasard comblera les vides.
          </div>
        </div>
        <div className="w-full md:w-1/5 bg-slate-800/50 rounded p-2 border border-slate-600 flex flex-col gap-4 pt-8">
          <div className="flex flex-col gap-2">
            <h3
              className={`text-yellow-400 font-bold text-center text-xs uppercase ${titleHeightClass}`}
            >
              Étoiles
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                const isSelected = selectedStars.includes(n);
                const isForbidden = forbiddenStars.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => toggleStar(n)}
                    className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                      isSelected
                        ? 'bg-yellow-400 border-yellow-200 text-yellow-900 scale-110 shadow-[0_0_10px_gold]'
                        : isForbidden
                        ? 'bg-red-900/50 border-red-900 text-red-500'
                        : 'bg-transparent border-yellow-700 text-yellow-600 hover:border-yellow-500'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-auto flex gap-2">
            <button
              onClick={handleReset}
              className="w-12 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center shadow-lg border border-red-400 transition-transform active:scale-95"
              title="Tout effacer"
            >
              <TrashIcon />
            </button>
            <button
              onClick={handleValidate}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded shadow-lg transform active:scale-95 transition-all text-xs uppercase tracking-wide border border-green-400"
            >
              {getButtonLabel()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- LOGIQUE & TYPES ---
type GameMode = 'boulotron' | 'goulotron' | 'selectron';
type GamePhase =
  | 'idle'
  | 'step1_right'
  | 'step2_middle'
  | 'step3_left'
  | 'finished'
  | 'bug';
interface ResultData {
  balls: number[];
  stars: number[];
}
interface HistoryItem {
  id: number;
  dateStr: string;
  timeStr: string;
  rank: number;
  mode: GameMode;
  data: ResultData;
}
const MAX_COMBINATIONS = 139838160;
const formatNumber = (num: number, length: number = 3): string =>
  num.toString().padStart(length, '0');
interface ScreenEffect {
  type:
    | 'normal'
    | 'bond'
    | 'beast'
    | 'repdigit'
    | 'palindrome'
    | 'gold'
    | 'seq'
    | 'magic';
  label?: string;
}
const analyzeNumber = (num: number): ScreenEffect => {
  const s = formatNumber(num);
  if (num === 7) return { type: 'bond', label: '007' };
  if (num === 666) return { type: 'beast', label: 'DEVIL' };
  if (num > 0 && s[0] === s[1] && s[1] === s[2]) return { type: 'repdigit' };
  if (s[0] === s[2]) return { type: 'palindrome' };
  return { type: 'normal' };
};
const analyzeGlobalPattern = (l: number, m: number, r: number) => {
  if (l === m && m === r) return { type: 'gold', label: 'TRIPLE PARFAIT !' };
  if (m === l + 1 && r === m + 1)
    return { type: 'seq', label: 'SUITE ROYALE !' };
  return null;
};
const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) res = (res * (n - i + 1)) / i;
  return Math.round(res);
};
const getRankFromCombination = (balls: number[], stars: number[]): number => {
  let ballRank = 1;
  let n = 50;
  let k = 5;
  let sortedBalls = [...balls].sort((a, b) => a - b);
  let currentNum = 1;
  for (let i = 0; i < k; i++) {
    const target = sortedBalls[i];
    while (currentNum < target) {
      ballRank += combinations(n - currentNum, k - i - 1);
      currentNum++;
    }
    currentNum++;
  }
  let starRank = 1;
  n = 12;
  k = 2;
  let sortedStars = [...stars].sort((a, b) => a - b);
  currentNum = 1;
  for (let i = 0; i < k; i++) {
    const target = sortedStars[i];
    while (currentNum < target) {
      starRank += combinations(n - currentNum, k - i - 1);
      currentNum++;
    }
    currentNum++;
  }
  return (ballRank - 1) * 66 + starRank;
};
const getCombinationAtIndex = (
  n: number,
  k: number,
  index: number
): number[] => {
  let result: number[] = [];
  let currentNumber = 1;
  let remainingK = k;
  let currentIndex = index;
  while (remainingK > 0) {
    const combinationsIfPicked = combinations(
      n - currentNumber,
      remainingK - 1
    );
    if (currentIndex <= combinationsIfPicked) {
      result.push(currentNumber);
      remainingK--;
    } else {
      currentIndex -= combinationsIfPicked;
    }
    currentNumber++;
  }
  return result;
};
const calculateEuroMillions = (rank: number): ResultData => {
  const zeroBasedRank = rank - 1;
  const numStarCombos = 66;
  const ballRank = Math.floor(zeroBasedRank / numStarCombos);
  const starRank = zeroBasedRank % numStarCombos;
  const balls = getCombinationAtIndex(50, 5, ballRank + 1);
  const stars = getCombinationAtIndex(12, 2, starRank + 1);
  return { balls, stars };
};

const useAudio = () => {
  const audioCtxRef = useRef<any>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended')
      audioCtxRef.current.resume();
  };
  const playTone = (
    freq: number,
    type: string,
    duration: number,
    vol: number = 0.1,
    slideTo: number | null = null
  ) => {
    if (muted || !audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    if (slideTo)
      osc.frequency.exponentialRampToValueAtTime(
        slideTo,
        audioCtxRef.current.currentTime + duration
      );
    gain.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtxRef.current.currentTime + duration
    );
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + duration);
  };
  const playTick = () => playTone(800, 'square', 0.03, 0.05);
  const playStop = () => playTone(300, 'triangle', 0.1, 0.2, 100);
  const playBug = () => {
    playTone(400, 'sawtooth', 0.4, 0.2, 50);
    setTimeout(() => playTone(300, 'sawtooth', 0.4, 0.2, 50), 150);
  };
  const playWin = () => {
    playTone(523.25, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100);
    setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 200);
    setTimeout(() => playTone(1046.5, 'sine', 0.4, 0.1), 300);
  };
  return { initAudio, playTick, playStop, playBug, playWin, muted, setMuted };
};

// --- COMPOSANTS VISUELS (MOTEUR) ---
function DisplayWindow({
  value,
  onClick,
  spinning,
  highlight,
  effect = { type: 'normal' },
}: any) {
  const [flashColor, setFlashColor] = useState<string | null>(null);
  useEffect(() => {
    let interval: any;
    if (spinning) {
      const colors = [
        'bg-lime-400',
        'bg-yellow-300',
        'bg-cyan-400',
        'bg-red-500',
      ];
      interval = setInterval(
        () => setFlashColor(colors[Math.floor(Math.random() * colors.length)]),
        80
      );
    } else setFlashColor(null);
    return () => clearInterval(interval);
  }, [spinning]);
  let bgClass = flashColor || 'bg-gradient-to-b from-cyan-200 to-cyan-500';
  let borderClass = 'border-yellow-600';
  let textClass = 'text-slate-900';
  let icon = null;
  let animClass = '';
  if (!spinning && effect.type !== 'normal') {
    switch (effect.type) {
      case 'bond':
        bgClass = 'bg-black';
        textClass = 'text-white';
        borderClass = 'border-gray-400';
        icon = <span className="absolute top-1 right-1 text-lg">🕶️</span>;
        break;
      case 'beast':
        bgClass = 'bg-red-600';
        textClass = 'text-yellow-300';
        borderClass = 'border-orange-900';
        icon = <span className="absolute top-1 right-1 text-lg">🔥</span>;
        break;
      case 'repdigit':
        bgClass = 'bg-slate-300';
        animClass = 'animate-shake';
        break;
      case 'palindrome':
        icon = (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-40 select-none">
            ↔️
          </span>
        );
        break;
      case 'gold':
        bgClass = 'bg-yellow-300';
        borderClass = 'border-yellow-100';
        animClass = 'animate-pulse';
        textClass = 'text-yellow-800';
        break;
      case 'seq':
        bgClass = 'bg-green-300';
        textClass = 'text-green-900';
        break;
      case 'magic':
        bgClass = 'bg-purple-800';
        textClass = 'text-yellow-300';
        borderClass = 'border-purple-300';
        icon = <span className="absolute top-1 right-1 text-lg">🧞‍♂️</span>;
        break;
    }
  }
  const glowClass = flashColor
    ? 'shadow-[0_0_30px_rgba(255,255,255,0.8)]'
    : 'shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]';
  if (flashColor === 'bg-red-500' || flashColor === 'bg-cyan-400')
    textClass = 'text-white';
  return (
    <div
      onClick={onClick}
      className={`relative w-24 h-32 ${bgClass} border-8 ${borderClass} rounded-lg ${glowClass} flex items-center justify-center overflow-hidden cursor-pointer transition-all active:scale-95 duration-75 ${
        highlight ? 'ring-4 ring-yellow-300 scale-105 z-10' : ''
      } ${animClass}`}
      style={{ minWidth: '6rem', minHeight: '8rem' }}
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-20 rounded-t-sm pointer-events-none"></div>
      {icon}
      <div
        className={`font-mono text-4xl font-bold ${textClass} drop-shadow-md ${
          spinning ? 'blur-[1px] scale-110' : ''
        } relative z-10`}
      >
        {formatNumber(value)}
      </div>
    </div>
  );
}

function Ball({
  num,
  isStar,
  mini = false,
}: {
  num: number;
  isStar: boolean;
  mini?: boolean;
}) {
  const sizeClasses = mini
    ? 'w-6 h-6 text-xs border'
    : 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-base sm:text-lg md:text-xl border-2';
  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),2px_2px_4px_rgba(0,0,0,0.3)] border-white/30 font-bold ${
        isStar
          ? 'bg-gradient-to-br from-yellow-400 to-orange-600 text-white'
          : 'bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900'
      }`}
    >
      {num}
    </div>
  );
}

function PointingHand({ phase }: { phase: GamePhase }) {
  const getPositionClass = () => {
    switch (phase) {
      case 'idle':
        return 'translate-x-[8rem] translate-y-[-2rem]';
      case 'step1_right':
        return 'translate-x-[0rem] translate-y-[-2rem]';
      case 'step2_middle':
        return 'translate-x-[-8rem] translate-y-[-2rem]';
      case 'step3_left':
        return 'translate-x-[0rem] translate-y-[-21rem] rotate-0';
      case 'finished':
      case 'bug':
        return 'translate-x-[0rem] translate-y-[9rem]';
      default:
        return 'hidden';
    }
  };
  if (
    [
      'idle',
      'step1_right',
      'step2_middle',
      'step3_left',
      'finished',
      'bug',
    ].indexOf(phase) === -1
  )
    return null;
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-500 ease-in-out ${getPositionClass()}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="animate-bounce drop-shadow-2xl filter relative">
        <HandIcon
          size={64}
          className="text-white fill-yellow-400 stroke-black stroke-2 transform"
          style={{
            transform:
              phase === 'finished' || phase === 'bug'
                ? 'rotate(180deg)'
                : 'rotate(0deg)',
          }}
        />
      </div>
    </div>
  );
}

function DrawerHandle({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="absolute left-1/2 -translate-x-1/2 z-30 cursor-pointer group"
      style={{ bottom: '35%' }}
    >
      <div className="w-48 h-12 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-xl border-4 border-yellow-800 shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-all animate-pulse px-2">
        <span className="style-jackpot text-2xl tracking-widest text-yellow-900 drop-shadow-sm">
          SÉLECTRON
        </span>
      </div>
      <div className="absolute -bottom-2 left-2 right-2 h-2 bg-black/30 rounded-full blur-sm"></div>
    </div>
  );
}

// =============================================================================
// 3. MOTEUR PRINCIPAL (APP)
// =============================================================================
export default function App() {
  useEffect(() => {
    const styleId = 'boulotron-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `.app-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #0f172a; color: white; font-family: sans-serif; overflow: hidden; } @media (min-width: 1024px) { .app-wrapper { flex-direction: row; } .sidebar-container { width: 18rem; height: 100vh; overflow-y: auto; border-right: 1px solid #334155; flex-shrink: 0; } .game-container { flex: 1; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; } .infos-container { width: 18rem; height: 100vh; overflow-y: auto; border-left: 1px solid #334155; flex-shrink: 0; background-color: rgba(30, 41, 59, 0.5); } } @media (max-width: 1023px) { .sidebar-container { width: 100%; height: auto; max-height: 30vh; overflow-y: auto; border-bottom: 1px solid #334155; } .game-container { width: 100%; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; } .infos-container { width: 100%; padding: 1rem; border-top: 1px solid #334155; } } @keyframes dropSpring { 0% { transform: translateY(-250%) rotate(-180deg) scale(0.5); opacity: 0; } 60% { transform: translateY(15%) rotate(10deg) scale(1.05); opacity: 1; } 80% { transform: translateY(-5%) rotate(-5deg) scale(0.95); } 100% { transform: translateY(0) rotate(0) scale(1); opacity: 1; } } .ball-anim { animation: dropSpring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; } @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } } .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; } .papi-container { width: 64px; height: 64px; min-width: 64px; max-width: 64px; border-radius: 50%; border: 2px solid #EAB308; overflow: hidden; margin: 0 auto 8px auto; background: white; } .papi-image { width: 100%; height: 100%; object-fit: cover; } .style-jackpot { font-family: 'Bangers', cursive; color: #FACC15; text-transform: uppercase; letter-spacing: 2px; transform: skewX(-5deg) rotate(-2deg); text-shadow: 3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 0px 0 #000, 0px 3px 0 #000, -3px 0px 0 #000, 0px -3px 0 #000, 5px 5px 5px rgba(0,0,0,0.5); } .style-schtroumpf { font-family: 'Chewy', cursive; color: #0EA5E9; text-transform: uppercase; letter-spacing: 1px; text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 0px 0 #fff, 0px 2px 0 #fff, -2px 0px 0 #fff, 0px -2px 0 #fff, 0 0 15px rgba(14, 165, 233, 0.8); } @media print { body * { visibility: hidden; } #history-printable, #history-printable * { visibility: visible; } #history-printable { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; padding: 20px; } .no-print { display: none !important; } .print-black-text { color: black !important; text-shadow: none !important; } }`;
      document.head.appendChild(style);
    }
  }, []);
  // --- CORRECTIF CHIRURGICAL IMPRESSION (DOUBLE COLONNE & ANTI-COUPURE) ---
  useEffect(() => {
    const stylePrintId = 'boulotron-expert-print-final';
    if (!document.getElementById(stylePrintId)) {
      const stylePrint = document.createElement('style');
      stylePrint.id = stylePrintId;
      stylePrint.innerHTML = `
        @media print {
          @page { size: A4; margin: 10mm; }
          body { background: white !important; color: black !important; overflow: visible !important; }
          .no-print, .game-container, .infos-container { display: none !important; }
          .app-wrapper { display: block !important; height: auto !important; }
          
          /* FORCE LE DÉPLIAGE TOTAL DE L'HISTORIQUE SANS COUPURE */
          .sidebar-container { 
            width: 100% !important; 
            height: auto !important; 
            overflow: visible !important; 
            display: block !important; 
            background: white !important; 
            padding: 0 !important; 
            border: none !important; 
          }
          
          /* GRILLE 2 COLONNES POUR VOTRE POCHE */
          .sidebar-container > div:last-child { 
            display: grid !important; 
            grid-template-columns: 1fr 1fr !important; 
            gap: 15px !important; 
            padding: 10px !important;
            overflow: visible !important;
          }

          /* TICKETS EN NOIR ET BLANC PUR POUR VOTRE POCHE */
          .sidebar-container div[style*="break-inside"] { 
            background: white !important; 
            border: 1.5pt solid black !important; 
            color: black !important;
            box-shadow: none !important;
            padding: 8px !important;
          }
          
          .text-white, .text-yellow-500, .text-cyan-400, .text-orange-400, .text-green-400, .text-red-500 { color: black !important; text-shadow: none !important; }
          .bg-slate-200 { background: white !important; border: 1pt solid black !important; color: black !important; }
          .bg-yellow-400 { background: #f0f0f0 !important; border: 1.5pt solid black !important; color: black !important; font-weight: bold !important; }
          
          /* MASQUAGE DE LA BARRE DE DÉFILEMENT INUTILE AU TABAC */
          ::-webkit-scrollbar { display: none !important; }
        }
      `;
      document.head.appendChild(stylePrint);
    }
  }, []);
  useEffect(() => {
    const scriptId = 'tailwind-cdn-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  useEffect(() => {
    const fontId = 'google-fonts-boulotron';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Bangers&family=Chewy&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const [gameMode, setGameMode] = useState<GameMode>('boulotron');
  const [goulotronInput, setGoulotronInput] = useState<string>('');
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [showTapis, setShowTapis] = useState(false);
  const [drawId, setDrawId] = useState(0);
  const [rightVal, setRightVal] = useState<number>(0);
  const [midVal, setMidVal] = useState<number>(0);
  const [leftVal, setLeftVal] = useState<number>(0);
  const [_finalRank, setFinalRank] = useState<number | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLimit, setHistoryLimit] = useState<number>(20);
  // NOUVEAU: Message du panneau central (Information)
  const [infoMessage, setInfoMessage] = useState<string>(
    "La Caisse à Outils de l'€Millions"
  );
  const [effects, setEffects] = useState<{
    left: ScreenEffect;
    mid: ScreenEffect;
    right: ScreenEffect;
    globalMsg: string | null;
  }>({
    left: { type: 'normal' },
    mid: { type: 'normal' },
    right: { type: 'normal' },
    globalMsg: null,
  });

  // STATES POUR L'APPLICATION DE LA STRATEGIE
  const [lunaireNums, setLunaireNums] = useState<number[]>([]);
  const [lunaireStars, setLunaireStars] = useState<number[]>([]);

  // STATE MODALE CODEX
  const [showCodex, setShowCodex] = useState(false);

  // STATE LUNAIRE (LE CERVEAU)
  const [lune, setLune] = useState<PhaseLune | null>(null);

  // EFFECT LUNAIRE (CALCUL AU DÉMARRAGE)
  useEffect(() => {
    const phaseActuelle = obtenirPhaseLunaire();
    setLune(phaseActuelle);
  }, []);

  const { initAudio, playTick, playStop, playBug, playWin, muted, setMuted } =
    useAudio();
  const rightInterval = useRef<any>(null);
  const midInterval = useRef<any>(null);
  const leftInterval = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startSpinning = (setter: any, max: number) =>
    setInterval(() => {
      setter(Math.floor(Math.random() * (max + 1)));
      playTick();
    }, 50);

  const handleTapisValidate = (balls: number[], stars: number[]) => {
    const rank = getRankFromCombination(balls, stars);
    setGameMode('selectron');
    setGoulotronInput(rank.toString());
    initAudio(); // ICI: Mode passe en 'selectron'
    const l = Math.floor(rank / 1000000);
    const m = Math.floor((rank % 1000000) / 1000);
    const r = rank % 1000;
    setLeftVal(l);
    setMidVal(m);
    setRightVal(r);
    const globalPattern = analyzeGlobalPattern(l, m, r);
    const efLeft = globalPattern
      ? { type: globalPattern.type as any }
      : analyzeNumber(l);
    const efMid = globalPattern
      ? { type: globalPattern.type as any }
      : analyzeNumber(m);
    const efRight = globalPattern
      ? { type: globalPattern.type as any }
      : analyzeNumber(r);
    setInfoMessage(
      globalPattern ? globalPattern.label! : 'Votre combinaison Sélectron'
    );
    setEffects({ left: efLeft, mid: efMid, right: efRight, globalMsg: null });
    setFinalRank(rank);
    processWin(rank);

    // FERMETURE PROPRE DU TAPIS (SANS DÉCLENCHER "ANNULÉ")
    setShowTapis(false);
  };
  const handleOpenTapis = () => setShowTapis(true);

  // --- FIX ZOMBIE MODE ---
  const handleCloseTapis = () => {
    setShowTapis(false);
    setLunaireNums([]);
    setLunaireStars([]);
    // FIX: On force l'état "Terminé" pour nettoyer l'affichage
    setPhase('finished');
    setInfoMessage('Tirage Sélectron annulé !'); // MESSAGE SPÉCIFIQUE DEMANDÉ
  };

  // GESTION DU CODEX
  const handleOpenCodex = () => setShowCodex(true);
  const handleCloseCodex = () => setShowCodex(false);
  const handleApplyStrategy = (nums: number[], stars: number[]) => {
    setLunaireNums(nums);
    setLunaireStars(stars);
    setShowCodex(false);
    setGameMode('selectron');
    setShowTapis(true);
  };

  const handleSiphonOfficial = () => {
    setGameMode('goulotron');
    const rankStr = INFOS.rang.replace(/\D/g, '');
    const rank = parseInt(rankStr);
    setGoulotronInput(rankStr);
    initAudio();
    const l = Math.floor(rank / 1000000);
    const m = Math.floor((rank % 1000000) / 1000);
    const r = rank % 1000;
    setLeftVal(l);
    setMidVal(m);
    setRightVal(r);
    const greenEffect: ScreenEffect = { type: 'seq' };
    setInfoMessage('SIPHONNAGE DU TIRAGE OFFICIEL !');
    setEffects({
      left: greenEffect,
      mid: greenEffect,
      right: greenEffect,
      globalMsg: null,
    });
    setFinalRank(rank);
    processWin(rank);
  };
  const handleSiphonMyMillion = () => {
    setGameMode('goulotron');
    const myMillionStr = INFOS.my_million.replace(/\D/g, '');
    const rank = parseInt(myMillionStr);
    setGoulotronInput(myMillionStr);
    initAudio();
    const l = Math.floor(rank / 1000000);
    const m = Math.floor((rank % 1000000) / 1000);
    const r = rank % 1000;
    setLeftVal(l);
    setMidVal(m);
    setRightVal(r);
    const blackEffect: ScreenEffect = { type: 'bond' };
    setInfoMessage('CODE MY MILLION DÉCRYPTÉ !');
    setEffects({
      left: blackEffect,
      mid: blackEffect,
      right: blackEffect,
      globalMsg: null,
    });
    setFinalRank(rank);
    processWin(rank);
  };
  const handleRightClick = () => {
    if (gameMode !== 'boulotron') return;
    if (phase === 'idle') {
      initAudio();
      setPhase('step1_right');
      setEffects({
        left: { type: 'normal' },
        mid: { type: 'normal' },
        right: { type: 'normal' },
        globalMsg: null,
      });
      /* setInfoMessage RETIRÉ ICI */ rightInterval.current = startSpinning(
        setRightVal,
        999
      );
    }
  };
  const handleMiddleClick = () => {
    if (phase === 'step1_right') {
      playStop();
      setPhase('step2_middle');
      clearInterval(rightInterval.current);
      midInterval.current = startSpinning(setMidVal, 999);
    }
  };
  const handleLeftClick = () => {
    if (phase === 'step2_middle') {
      playStop();
      setPhase('step3_left');
      clearInterval(midInterval.current);
      leftInterval.current = startSpinning(setLeftVal, 139);
    }
  };
  const handleLampClick = () => {
    if (phase === 'step3_left') {
      clearInterval(leftInterval.current);
      const total = leftVal * 1000000 + midVal * 1000 + rightVal;
      setFinalRank(total);

      // AJOUT : Délai de 0.5s pour le suspense Boulotron
      setTimeout(() => {
        const globalPattern = analyzeGlobalPattern(leftVal, midVal, rightVal);
        const efLeft = globalPattern
          ? { type: globalPattern.type as any }
          : analyzeNumber(leftVal);
        const efMid = globalPattern
          ? { type: globalPattern.type as any }
          : analyzeNumber(midVal);
        const efRight = globalPattern
          ? { type: globalPattern.type as any }
          : analyzeNumber(rightVal);
        // INFO MESSAGE AJOUTÉ ICI (Après le délai)
        setInfoMessage(
          globalPattern ? globalPattern.label! : 'Votre combinaison Boulotron'
        );
        setEffects({
          left: efLeft,
          mid: efMid,
          right: efRight,
          globalMsg: null,
        });
        processWin(total);
      }, 500);
    }
  };

  // MODIFICATION ULTIMATE TOUCH : Masque de saisie avec espaces
  const handleGoulotronInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let val = e.target.value.replace(/\D/g, ''); // Garde uniquement les chiffres
    if (val.length > 9) val = val.slice(0, 9); // Limite à 9 chiffres
    // Ajoute un espace tous les 3 chiffres
    const formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    setGoulotronInput(formatted);
  };

  const handleGoulotronSubmit = () => {
    initAudio();
    // On enlève les espaces avant de parser
    const rank = parseInt(goulotronInput.replace(/\s/g, ''));
    if (isNaN(rank) || rank < 1 || rank > MAX_COMBINATIONS) {
      playBug();
      alert(
        `Erreur: Le rang doit être compris entre 1 et ${MAX_COMBINATIONS.toLocaleString()}`
      );
      setGoulotronInput('');
      return;
    }
    const l = Math.floor(rank / 1000000);
    const m = Math.floor((rank % 1000000) / 1000);
    const r = rank % 1000;
    setLeftVal(l);
    setMidVal(m);
    setRightVal(r);
    const globalPattern = analyzeGlobalPattern(l, m, r);
    const efLeft = globalPattern
      ? { type: globalPattern.type as any }
      : analyzeNumber(l);
    const efMid = globalPattern
      ? { type: globalPattern.type as any }
      : analyzeNumber(m);
    const efRight = globalPattern
      ? { type: globalPattern.type as any }
      : analyzeNumber(r);
    setInfoMessage(
      globalPattern ? globalPattern.label! : 'Votre combinaison Goulotron'
    );
    setEffects({ left: efLeft, mid: efMid, right: efRight, globalMsg: null });
    setFinalRank(rank);
    processWin(rank);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGoulotronSubmit();
  };
  const processWin = (rank: number) => {
    if (rank > MAX_COMBINATIONS) {
      setPhase('bug');
      playBug();
    } else {
      const winRank = rank === 0 ? 1 : rank;
      const res = calculateEuroMillions(winRank);
      setDrawId((prev) => prev + 1);
      setResultData(res);
      setPhase('finished');
      playWin();
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-FR');
      const timeStr = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const newItem: HistoryItem = {
        id: Date.now(),
        dateStr: dateStr,
        timeStr: timeStr,
        rank: winRank,
        mode: gameMode,
        data: res,
      };
      setHistory((prev) => [newItem, ...prev].slice(0, historyLimit));
    }
  };

  // RESET NETTOYEUR (Ferme tout)
  const resetGame = () => {
    setPhase('idle');
    setRightVal(0);
    setMidVal(0);
    setLeftVal(0);
    setFinalRank(null);
    setResultData(null);
    setGoulotronInput('');
    setEffects({
      left: { type: 'normal' },
      mid: { type: 'normal' },
      right: { type: 'normal' },
      globalMsg: null,
    });
    setInfoMessage("La Caisse à Outils de l'€Millions");
    clearInterval(rightInterval.current);
    clearInterval(midInterval.current);
    clearInterval(leftInterval.current);
    setShowTapis(false); // On ferme toujours le tapis par défaut
  };

  // --- NOUVEAU MODULE DE TÉLÉCHARGEMENT EXPERT ---
  const handleDownloadCSV = () => {
    if (history.length === 0) return;
    
    // Entêtes pour fusion de données (1000+ lignes)
    const headers = [
      "Session_#", "Source", "Date", "Heure", "Phase_Lune", 
      "Rang_Global", "B1", "B2", "B3", "B4", "B5", 
      "E1", "E2", "Poids_Somme", "Signature_Dizaines"
    ];

    const rows = history.map((item, index) => {
      // Calcul du poids (Somme des 5 boules)
      const poids = item.data.balls.reduce((acc: number, curr: number) => acc + curr, 0);
      
      // Extraction de la signature (on utilise votre logique DecadeBouloscope)
      const dist = [0, 0, 0, 0, 0];
      item.data.balls.forEach((n) => {
        const dIndex = Math.ceil(n / 10) - 1;
        if (dIndex >= 0 && dIndex < 5) dist[dIndex]++;
      });
      const signature = dist.map((count, i) => (count > 0 ? i + 1 : '')).join('');

      return [
        history.length - index,
        item.mode.toUpperCase(),
        item.dateStr,
        item.timeStr,
        lune?.nom || "Non calculée",
        item.rank.toString().replace(/\s/g, ''), // Rang pur pour Excel
        ...[...item.data.balls].sort((a, b) => a - b),
        ...[...item.data.stars].sort((a, b) => a - b),
        poids,
        signature
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Boulotron_Expert_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SWITCH MODE (Utilise Reset Nettoyeur)
  const switchMode = (mode: GameMode) => {
    resetGame();
    setGameMode(mode);
  };

  // REPLAY INTELLIGENT (Appelé par le bandeau bleu)
  const handleReplay = () => {
    const currentMode = gameMode;
    resetGame(); // On nettoie
    if (currentMode === 'selectron') {
      setShowTapis(true);
    } // On rouvre si c'était Sélectron
  };

  const handlePrint = () => window.print();

  useEffect(() => {
    clearInterval(rightInterval.current);
    clearInterval(midInterval.current);
    clearInterval(leftInterval.current);
  }, []);
  const showInput = gameMode === 'goulotron' && phase === 'idle';
  const machineStyle = {
    position: 'relative' as any,
    width: '100%',
    maxWidth: '36rem',
    display: 'flex',
    flexDirection: 'column' as any,
    alignItems: 'center',
  };
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);
  const isLampGreen = ['step1_right', 'step2_middle', 'step3_left'].includes(
    phase
  );
  // const isAnySpinning = ['step1_right', 'step2_middle', 'step3_left'].includes(
  //   phase
  // );

  // --- LOGIQUE INSTRUCTION (BANDEAU BLEU) ---
  const getInstructionMessage = () => {
    switch (phase) {
      case 'idle':
        return gameMode === 'boulotron'
          ? 'Bienvenue dans la Caisse à Outils de Papi ! Cliquez à droite pour lancer ➔'
          : 'Saisissez un rang et validez avec [ENTRÉE]';
      case 'step1_right':
        return "Cliquez sur l'écran du milieu pour continuer";
      case 'step2_middle':
        return "Cliquez sur l'écran de gauche pour continuer";
      case 'step3_left':
        return 'CLIQUEZ SUR LA LAMPE VERTE POUR VALIDER !';
      case 'finished':
        return 'Tirage terminé ! Cliquez ici pour rejouer';
      case 'bug':
        return "Y'A UN BUG ! (Cliquez pour réinitialiser)";
      default:
        return '';
    }
  };

  // NOUVEAU: Date du jour pour la météo
  const todayStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="app-wrapper">
      {/* TAPIS VOLANT (MODALE) */}
      {showTapis && (
        <TapisVolant
          onClose={handleCloseTapis}
          onValidate={handleTapisValidate}
          initialNums={lunaireNums}
          initialStars={lunaireStars}
        />
      )}

      {/* CODEX READER (MODALE) */}
      {showCodex && (
        <CodexReader onClose={handleCloseCodex} onApply={handleApplyStrategy} />
      )}

      {/* SIDEBAR GAUCHE */}
      <div
        id="history-printable"
        className="sidebar-container bg-slate-800/50 p-4"
      >
        <div className="flex flex-col mb-4 border-b border-slate-600 pb-2">
          <div className="flex items-center justify-between w-full">
            {/* 1. TITRE ET COMPTEUR DYNAMIC */}
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-yellow-400 print-black-text uppercase tracking-tighter">
                Historique
              </h2>
              <div className="flex items-center bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700 ml-1">
                <span className="text-sm font-bold text-white font-mono">{history.length}</span>
                <span className="text-sm font-bold text-white font-mono">/{historyLimit}</span>
              </div>
            </div>

            {/* 2. BLOC D'ACTIONS HARMONISÉ (ROUE + IMPRIMANTE + CSV) */}
            <div className="flex items-center gap-4 no-print">
              <button 
                onClick={() => {
                  const input = window.prompt("Capacité de l'historique (ex: 30, 50, 100) :", historyLimit.toString());
                  if (input !== null) {
                    const nouvelleValeur = parseInt(input);
                    if (!isNaN(nouvelleValeur) && nouvelleValeur > 0) {
                      setHistoryLimit(nouvelleValeur > 200 ? 200 : nouvelleValeur);
                    }
                  }
                }}
                className="text-slate-400 hover:text-white transition-all hover:rotate-90 bg-transparent"
                title="Régler la capacité"
              >
                <SettingsIcon size={18} />
              </button>

              <button onClick={handlePrint} className="text-slate-400 hover:text-white transition-colors bg-transparent">
                <PrinterIcon size={18} />
              </button>
              
              <button onClick={handleDownloadCSV} className="flex items-center gap-1 text-green-600 hover:text-green-400 transition-colors text-[10px] font-bold bg-transparent">
                <DownloadIcon size={18} /> (.csv)
              </button>
            </div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-slate-500 text-center italic mt-10 print-black-text">
            Aucun tirage enregistré...
            <br />
            Lancez le Boulotron !
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900/80 p-2 rounded border border-slate-600 shadow-sm print-black-text flex flex-col gap-1"
                style={{
                  breakInside: 'avoid',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                }}
              >
                {/* LIGNE 1 : CHRONO, RANG ET SIGNATURE DIZAINES (VERSION EXPERT) */}
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-slate-700/50 pb-1 mb-1">
                  {/* GAUCHE : Chrono + Rang */}
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">#{history.length - idx}</span>
                    <div className="text-yellow-500 font-bold">
                      <span className="text-white font-normal text-[10px]">Rang : </span>
                      {item.rank.toLocaleString()}
                    </div>
                  </div>

                  {/* DROITE : Signature Dizaines dynamique */}
                  <div className="flex items-center">
                    {(() => {
                      const dist = [0, 0, 0, 0, 0];
                      item.data.balls.forEach((n) => {
                        const dIndex = Math.ceil(n / 10) - 1;
                        if (dIndex >= 0 && dIndex < 5) dist[dIndex]++;
                      });
                      const indicesSortis = dist.map((count, i) => (count > 0 ? i + 1 : null)).filter((v) => v !== null);
                      const grandChelem = dist.findIndex((count) => count === 5);
                      
                      // LOGIQUE COULEUR : Rouge (Chelem), Orange (<3 ou 5 dizaines), Vert (3 ou 4)
                      const isOrange = indicesSortis.length < 3 || indicesSortis.length === 5;
                      const colorClass = grandChelem !== -1 ? 'text-red-500 animate-pulse' : isOrange ? 'text-orange-400' : 'text-green-400';
                      const label = grandChelem !== -1 ? `CHELEM ${grandChelem + 1}` : indicesSortis.join('');

                      return (
                        <div className={`font-bold ${colorClass}`}>
                          <span className="text-white font-normal text-[10px]">Dizaines : </span>
                          {label}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 justify-center py-1">
                  {item.data.balls.map((b) => (
                    <span
                      key={b}
                      className="w-6 h-6 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center text-xs font-bold border border-slate-400 print-black-text shadow-sm"
                    >
                      {b}
                    </span>
                  ))}
                  <div className="w-px bg-slate-600 mx-1 h-4 self-center"></div>
                  {item.data.stars.map((s) => (
                    <span
                      key={s}
                      className="w-6 h-6 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center text-xs font-bold border border-yellow-600 print-black-text shadow-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
               
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ZONE DE JEU */}
      <div className="game-container relative no-print">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMuted(!muted);
            initAudio();
          }}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-50 bg-transparent"
        >
          {muted ? <MuteIcon size={32} /> : <VolumeIcon size={32} />}
        </button>

        <div
          style={machineStyle}
          className="relative w-full max-w-xl flex flex-col items-center"
        >
          {!showTapis && <PointingHand phase={phase} />}
          <div
            className={`relative z-20 -mb-4 flex flex-col items-center transition-opacity duration-300 ${
              gameMode === 'goulotron'
                ? 'opacity-20 pointer-events-none'
                : 'opacity-100'
            }`}
          >
            <div
              onClick={handleLampClick}
              className={`w-24 h-20 rounded-t-full border-4 border-yellow-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                isLampGreen
                  ? 'bg-green-500 shadow-[0_0_30px_#22c55e]'
                  : 'bg-red-600 shadow-[0_0_10px_#991b1b]'
              } ${phase === 'step3_left' ? 'animate-bounce' : ''}`}
              style={{
                backgroundColor: isLampGreen ? '#22c55e' : '#dc2626',
                width: '6rem',
                height: '5rem',
                borderTopLeftRadius: '999px',
                borderTopRightRadius: '999px',
                border: '4px solid #a16207',
              }}
            ></div>
            <div
              className="w-32 h-4 bg-yellow-600 rounded-t"
              style={{
                width: '8rem',
                height: '1rem',
                backgroundColor: '#ca8a04',
                borderTopLeftRadius: '0.25rem',
                borderTopRightRadius: '0.25rem',
              }}
            ></div>
          </div>
          <div
            className={`bg-red-700 w-full rounded-t-[3rem] rounded-b-lg p-2 border-4 ${
              gameMode !== 'boulotron'
                ? 'border-cyan-600 shadow-[0_0_40px_rgba(8,145,178,0.6)]'
                : 'border-yellow-600 shadow-2xl'
            } relative overflow-hidden transition-all duration-500`}
            style={{
              backgroundColor: '#b91c1c',
              border:
                gameMode !== 'boulotron'
                  ? '4px solid #0891b2'
                  : '4px solid #ca8a04',
              borderRadius: '3rem 3rem 0.5rem 0.5rem',
              padding: '0.5rem',
            }}
          >
            <div
              className={`absolute top-0 left-0 w-full h-24 rounded-t-[2.5rem] border-b-4 overflow-hidden transition-colors duration-500 ${
                gameMode !== 'boulotron'
                  ? 'bg-slate-900 border-cyan-500'
                  : 'bg-purple-900 border-yellow-500'
              }`}
            >
              <div
                className="flex justify-center items-center h-full space-x-6"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  gap: '1.5rem',
                }}
              >
                <button
                  onClick={() => switchMode('goulotron')}
                  className={`transform transition-all duration-300 hover:scale-110 bg-transparent ${
                    gameMode === 'goulotron'
                      ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-110'
                      : 'text-slate-400 hover:text-cyan-200'
                  }`}
                >
                  <FunnelIcon size={40} />
                </button>
                <h1
                  className={`text-4xl sm:text-5xl font-black tracking-wider transition-all duration-300 ${
                    gameMode === 'boulotron'
                      ? 'style-jackpot'
                      : 'style-schtroumpf'
                  }`}
                >
                  {gameMode === 'boulotron'
                    ? 'BOULOTRON'
                    : gameMode === 'selectron'
                    ? 'SÉLECTRON'
                    : 'GOULOTRON'}
                </h1>
                <button
                  onClick={() => switchMode('boulotron')}
                  className={`transform transition-all duration-300 hover:scale-110 bg-transparent ${
                    gameMode === 'boulotron'
                      ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] scale-110'
                      : 'text-slate-400 hover:text-yellow-200'
                  }`}
                >
                  <SphereIcon size={40} />
                </button>
              </div>
            </div>
            <div
              className="mt-24 mb-6 bg-cyan-900 p-6 rounded-xl border-4 border-yellow-500 shadow-inner flex justify-center gap-2 sm:gap-4 relative z-10 min-h-[160px] items-center"
              style={{
                marginTop: '6rem',
                marginBottom: '1.5rem',
                backgroundColor: '#164e63',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '4px solid #eab308',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                minHeight: '160px',
                alignItems: 'center',
              }}
            >
              {showInput && (
                <div
                  className="w-full flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 absolute top-4"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'absolute',
                    top: '1rem',
                  }}
                >
                  <div className="text-cyan-300 font-mono text-sm uppercase tracking-widest">
                    Saisissez un rang cible
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={goulotronInput}
                    onChange={handleGoulotronInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: 123 456 789"
                    className="w-full text-center text-3xl font-mono font-bold border-b-4 border-cyan-600 focus:outline-none py-2 rounded shadow-inner bg-gradient-to-b from-cyan-200 to-cyan-500 text-slate-900 caret-black placeholder-cyan-700/50"
                    style={{
                      width: '100%',
                      background:
                        'linear-gradient(to bottom, #a5f3fc, #06b6d4)',
                      textAlign: 'center',
                      fontSize: '1.875rem',
                      fontWeight: 'bold',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      borderBottom: '4px solid #0891b2',
                    }}
                    maxLength={11}
                  />
                  <div className="text-cyan-600 text-xs italic">
                    Appuyez sur [ENTRÉE] pour valider
                  </div>
                </div>
              )}
              {!showInput && (
                <>
                  <DisplayWindow
                    value={leftVal}
                    onClick={handleLeftClick}
                    spinning={phase === 'step3_left'}
                    highlight={phase === 'step2_middle'}
                    effect={phase === 'finished' ? effects.left : undefined}
                  />
                  <DisplayWindow
                    value={midVal}
                    onClick={handleMiddleClick}
                    spinning={phase === 'step2_middle'}
                    highlight={phase === 'step1_right'}
                    effect={phase === 'finished' ? effects.mid : undefined}
                  />
                  <DisplayWindow
                    value={rightVal}
                    onClick={handleRightClick}
                    spinning={phase === 'step1_right'}
                    highlight={phase === 'idle'}
                    effect={phase === 'finished' ? effects.right : undefined}
                  />
                </>
              )}
            </div>

            {/* --- NOUVEAU PANNEAU CENTRAL (INFORMATION ZONE) --- */}
            <div
              className="h-12 bg-slate-900 rounded-lg mb-2 flex items-center justify-center px-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border-2 border-cyan-500/30 overflow-hidden"
              style={{
                height: '3rem',
                backgroundColor: '#0f172a',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(6,182,212,0.3)',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              <div className="font-mono font-bold text-[#FFFF00] text-lg sm:text-xl uppercase tracking-widest text-shadow-glow animate-pulse">
                {infoMessage}
              </div>
            </div>

            <div
              className="h-24 mx-2 sm:mx-8 mb-2 bg-gradient-to-b from-yellow-200 to-yellow-600 rounded-lg border-4 border-yellow-700 shadow-inner flex items-center justify-center relative overflow-visible cursor-pointer"
              style={{
                height: '6rem',
                margin: '0 2rem 0.5rem 2rem',
                background: 'linear-gradient(to bottom, #fef08a, #ca8a04)',
                borderRadius: '0.5rem',
                border: '4px solid #a16207',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="absolute inset-0 bg-yellow-500/20 skew-x-12 pointer-events-none overflow-hidden rounded-lg"></div>
              {phase === 'idle' ? (
                <DrawerHandle onClick={handleOpenTapis} />
              ) : null}
              {phase === 'finished' && resultData && (
                <div
                  onClick={resetGame}
                  key={drawId}
                  className="flex gap-1 sm:gap-2 z-10"
                  style={{ display: 'flex', gap: '0.5rem' }}
                >
                  {resultData.balls.map((num, i) => (
                    <div
                      key={`b-${i}`}
                      className="ball-anim"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <Ball num={num} isStar={false} />
                    </div>
                  ))}
                  <div className="w-px h-10 bg-yellow-800/30 mx-1"></div>
                  {resultData.stars.map((num, i) => (
                    <div
                      key={`s-${i}`}
                      className="ball-anim"
                      style={{
                        animationDelay: `${
                          (resultData.balls.length + i) * 0.1
                        }s`,
                      }}
                    >
                      <Ball num={num} isStar={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="absolute top-32 -right-8 w-8 h-32 bg-gradient-to-r from-gray-300 to-gray-500 rounded-r-full border-2 border-gray-600 z-[-1]">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-16 bg-gray-400"></div>
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-400 shadow-lg"></div>
            </div>
          </div>

          {/* BANDEAU BLEU (INSTRUCTIONS UNIQUEMENT) */}
          <div
            onClick={
              phase === 'finished' || phase === 'bug' ? handleReplay : undefined
            }
            className={`mt-6 w-full h-16 rounded flex items-center justify-center relative border-t-4 border-blue-300 shadow-xl overflow-hidden bg-gradient-to-r from-blue-700 to-blue-500 ${
              phase === 'finished' || phase === 'bug'
                ? 'cursor-pointer hover:brightness-110'
                : ''
            }`}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              height: '4rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '4px solid #93c5fd',
              background: 'linear-gradient(to right, #1d4ed8, #3b82f6)',
            }}
          >
            <div
              className={`text-blue-100 font-bold uppercase tracking-widest text-center px-4 ${
                phase === 'bug'
                  ? 'text-red-300 animate-pulse font-serif text-2xl'
                  : 'text-sm sm:text-lg'
              }`}
            >
              {phase === 'bug' 
        ? "Y'A UN BUG ! (Cliquez pour réinitialiser)"
        : getInstructionMessage()
      }
           </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <PapiAvatar />
            <p className="text-yellow-500 font-serif italic text-sm mb-2">
              "Le hasard, ça se travaille ! La chance, ça se tente !"
            </p>
            
            <a href="mailto:coditor@pm.me" className="text-cyan-400 text-xs transition-all mb-2 block">
              coditor@pm.me
            </a>
            
            <div className="text-[10px] text-white/60 leading-none">
              <p className="font-bold uppercase tracking-widest mb-1 text-white/80">
                ◀ PHASE DE TEST & EXPÉRIMENTATION - APPLICATION 100% GRATUITE ▶
              </p>
              <p>Le Boulotron est un outil indépendant d'aide à la décision.</p>
              <p>Les analyses sont basées sur l'historique officiel des tirages de la FDJ.</p>
              <p>Non affilié à la FDJ. Suggestions aléatoires sans garantie de gain.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR DROITE (INFOS) */}
      <div className="infos-container p-4 text-sm text-slate-300 font-mono">
        <div className="flex items-center justify-between mb-4 border-b border-cyan-800 pb-2">
          <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wide">
            Infos Tirage
          </h2>
          <button
            onClick={handleOpenCodex}
            className="text-yellow-400 hover:text-white transition-colors"
            title="Ouvrir le Codex du Boulotron"
          >
            <BookIcon size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* --- NOUVEAU MODULE MÉTÉO LUNAIRE --- */}
          {lune && (
            <div
              onClick={handleOpenCodex}
              className={`relative overflow-hidden p-3 rounded border-l-4 shadow-sm transition-all duration-500 cursor-pointer group ${
                lune.favorable
                  ? 'bg-green-900/30 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:bg-green-900/50'
                  : 'bg-slate-800/80 border-slate-600 hover:bg-slate-700/80'
              }`}
              title="Ouvrir le Codex Lunaire"
            >
              <div className="flex justify-between items-baseline mb-2 border-b border-white/10 pb-1">
                <span className="text-[10px] text-white uppercase tracking-widest font-bold">
                  Météo Astrale
                </span>
                <span className="text-[10px] text-white font-mono capitalize">
                  {todayStr}
                </span>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="text-4xl filter drop-shadow-md animate-pulse">
                  {lune.icone}
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={`font-bold uppercase text-sm ${
                      lune.favorable ? 'text-green-400' : 'text-slate-200'
                    }`}
                  >
                    {lune.nom}
                  </span>
                  <span
                    className={`text-xs italic mt-1 ${
                      lune.favorable ? 'text-green-200' : 'text-slate-500'
                    }`}
                  >
                    {lune.conseil}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              {lune.favorable && (
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-500/20 blur-xl rounded-full pointer-events-none"></div>
              )}
            </div>
          )}

          <div
            onClick={handleSiphonOfficial}
            className="bg-slate-800/80 p-3 rounded border border-slate-600 shadow-sm cursor-pointer hover:bg-slate-700/50 hover:border-cyan-500 transition-all group relative overflow-hidden"
            title="Cliquez pour siphonner ce tirage !"
          >
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="text-[10px] text-slate-300 uppercase mb-1 font-semibold tracking-wide group-hover:text-cyan-300">
              {INFOS.titre_entete}
            </div>
            <div className="font-bold text-white mb-2">
              {INFOS.numero_et_date}
            </div>
            <div className="flex gap-1 mb-2">
              {INFOS.boules.map((b, i) => (
                <span
                  key={i}
                  className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-bold border border-slate-300 shadow-sm"
                >
                  {b}
                </span>
              ))}
              <div className="w-px bg-slate-600 mx-1"></div>
              {INFOS.etoiles.map((e, i) => (
                <span
                  key={i}
                  className="w-6 h-6 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center text-xs font-bold border border-yellow-600 shadow-sm"
                >
                  {e}
                </span>
              ))}
            </div>
            <div className="text-yellow-400 font-bold border-t border-slate-700 pt-2 mt-2 group-hover:text-yellow-300">
              {INFOS.rang}
            </div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded border-l-4 border-l-green-500 shadow-sm">
            <div className="text-slate-300">{INFOS.gagnants}</div>
            <div className="font-bold text-green-400 text-lg my-1">
              {INFOS.gain_montant}
            </div>
            <div className="text-slate-400 text-xs italic">
              {INFOS.gain_lieu}
            </div>
          </div>
          <div
            onClick={handleSiphonMyMillion}
            className="bg-slate-800/80 p-3 rounded border-l-4 border-l-blue-500 shadow-sm cursor-pointer hover:bg-slate-700/50 hover:border-white transition-all group"
            title="Décrypter le code My Million !"
          >
            <div className="text-blue-300 font-bold group-hover:text-white transition-colors">
              {INFOS.my_million}
            </div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded border-l-4 border-l-yellow-500 shadow-sm">
            <div className="text-xs text-slate-400 uppercase mb-1">
              {INFOS.prochain_date}
            </div>
            <div className="text-yellow-400 font-black text-base">
              {INFOS.prochain_jackpot}
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}
