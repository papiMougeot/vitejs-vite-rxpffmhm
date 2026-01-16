import React from 'react';
import { leSaviezVousData } from './eSaviezVous';

interface LeSaviezVousModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeSaviezVousModal: React.FC<LeSaviezVousModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl" role="img" aria-label="ampoule">💡</span>
              <h2 className="text-2xl font-bold text-gray-800">{leSaviezVousData.titre}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-gray-700 mt-2 italic">{leSaviezVousData.introduction}</p>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          {leSaviezVousData.evenements.map((event, index) => (
            <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
              <div className="flex items-start gap-2">
                <span className="text-2xl">{event.icone}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{event.titre}</h3>
                  
                  {event.sousCas ? (
                    <div className="mt-2 space-y-2">
                      {event.sousCas.map((sousCas, idx) => (
                        <div key={idx} className="ml-4">
                          <p className="text-gray-700">
                            <span className="font-semibold">{sousCas.label}</span> : {sousCas.numeros}
                          </p>
                          <p className="text-sm text-gray-600">→ {sousCas.details}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 font-mono text-lg">{event.numeros}</p>
                      <p className="text-sm text-gray-600">→ {event.details}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pied de page */}
        <div className="bg-gray-50 p-4 rounded-b-lg text-center">
          <button 
            onClick={onClose}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};