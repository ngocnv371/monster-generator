
import React from 'react';
import { type Monster, GenerationStatus } from '../types';
import Spinner from './Spinner';

interface MonsterCardProps {
  monster: Monster;
  onSelect: () => void;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onSelect }) => {
  const primaryImage =
    monster.primaryImageIndex !== null && monster.images[monster.primaryImageIndex]
      ? `data:image/jpeg;base64,${monster.images[monster.primaryImageIndex].base64}`
      : `https://picsum.photos/seed/${monster.id}/500/500`;

  const isPending = monster.textGenerationStatus === GenerationStatus.PENDING;

  return (
    <div
      onClick={onSelect}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      <div className="relative aspect-square w-full bg-gray-700">
        {isPending ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="w-10 h-10 text-purple-400" />
          </div>
        ) : (
          <img
            src={primaryImage}
            alt={monster.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-white">{monster.name}</h3>
      </div>
    </div>
  );
};

export default MonsterCard;
