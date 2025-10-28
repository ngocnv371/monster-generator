
import React, { useState, useMemo } from 'react';
import { type Monster } from '../types';
import MonsterCard from './MonsterCard';
import Pagination from './Pagination';
import { ITEMS_PER_PAGE } from '../constants';
import { SearchIcon } from './icons';

interface MonsterGridProps {
  monsters: Monster[];
  onSelectMonster: (id: string) => void;
}

const MonsterGrid: React.FC<MonsterGridProps> = ({ monsters, onSelectMonster }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMonsters = useMemo(() => {
    return monsters.filter(monster =>
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [monsters, searchTerm]);

  const paginatedMonsters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMonsters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMonsters, currentPage]);

  if (monsters.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400">Your beastiary is empty.</h2>
        <p className="text-gray-500 mt-2">Click "Generate New Monster" to begin your collection.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search for a monster..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
