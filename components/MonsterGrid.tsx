
import React, { useState, useMemo } from 'react';
import { type Monster } from '../types';
import MonsterCard from './MonsterCard';
import Pagination from './Pagination';
import { ITEMS_PER_PAGE, TEXTURES, HABITATS, CHARACTERS } from '../constants';
import { SearchIcon } from './icons';

interface MonsterGridProps {
  monsters: Monster[];
  onSelectMonster: (id: string) => void;
}

const MonsterGrid: React.FC<MonsterGridProps> = ({ monsters, onSelectMonster }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [textureFilter, setTextureFilter] = useState('');
  const [habitatFilter, setHabitatFilter] = useState('');
  const [characterFilter, setCharacterFilter] = useState('');

  const filteredMonsters = useMemo(() => {
    return monsters.filter(monster => {
        const nameMatch = monster.name.toLowerCase().includes(searchTerm.toLowerCase());
        const textureMatch = textureFilter === '' || monster.criteria.textures.includes(textureFilter);
        const habitatMatch = habitatFilter === '' || monster.criteria.habitat === habitatFilter;
        const characterMatch = characterFilter === '' || monster.criteria.character === characterFilter;
        return nameMatch && textureMatch && habitatMatch && characterMatch;
    });
  }, [monsters, searchTerm, textureFilter, habitatFilter, characterFilter]);

  const paginatedMonsters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMonsters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMonsters, currentPage]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setter(e.target.value);
      setCurrentPage(1);
  };

  if (monsters.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400">Your beastiary is empty.</h2>
        <p className="text-gray-500 mt-2">Click "Generate New Monster" to begin your collection.</p>
      </div>
    );
  }

  const selectStyles = "w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors";

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for a monster..."
            value={searchTerm}
            onChange={handleFilterChange(setSearchTerm)}
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select value={textureFilter} onChange={handleFilterChange(setTextureFilter)} className={selectStyles}>
              <option value="">All Textures</option>
              {TEXTURES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select value={habitatFilter} onChange={handleFilterChange(setHabitatFilter)} className={selectStyles}>
              <option value="">All Habitats</option>
              {HABITATS.map(h => <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>)}
          </select>
          <select value={characterFilter} onChange={handleFilterChange(setCharacterFilter)} className={selectStyles}>
              <option value="">All Characters</option>
              {CHARACTERS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedMonsters.map(monster => (
          <MonsterCard key={monster.id} monster={monster} onSelect={() => onSelectMonster(monster.id)} />
        ))}
      </div>

      {filteredMonsters.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredMonsters.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MonsterGrid;
