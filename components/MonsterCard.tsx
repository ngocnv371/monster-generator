import React from 'react';
import { type Monster, GenerationStatus } from '../types';
import Spinner from './Spinner';

interface MonsterCardProps {
  monster: Monster;
  onSelect: () => void;
}

const rarityColorMap: { [key: string]: string } = {
  'Common': 'bg-gray-500 text-white',
  'Uncommon': 'bg-green-600 text-white',
  'Rare': 'bg-blue-600 text-white',
  'Epic': 'bg-purple-600 text-white',
  'Legendary': 'bg-orange-500 text-white',
  'Mythical': 'bg-red-600 text-white',
  'default': 'bg-gray-700 text-gray-300',
};


const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onSelect }) => {
  const primaryImage =
    monster.primaryImageIndex !== null && monster.images[monster.primaryImageIndex]
      ? `data:image/jpeg;base64,${monster.images[monster.primaryImageIndex].base64}`
      : `https://picsum.photos/seed/${monster.id}/300/400`;

  const isPending = monster.textGenerationStatus === GenerationStatus.PENDING;

  return (
    <div
      onClick={onSelect}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col"
    >
      <div className="relative aspect-[3/4] w-full bg-gray-700">
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
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center gap-2">
            <h3 className="text-lg font-bold truncate text-white flex-1">{monster.name}</h3>
            {monster.textGenerationStatus === GenerationStatus.SUCCESS && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${rarityColorMap[monster.rarity] || rarityColorMap['default']}`}>
                    {monster.rarity}
                </span>
            )}
        </div>
        <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden text-ellipsis flex-grow">{monster.shortDescription}</p>
      </div>
    </div>
  );
};

export default MonsterCard;
