import React, { useState, useMemo } from 'react';
import { type Monster } from '../types';
import MonsterCard from './MonsterCard';
import Pagination from './Pagination';
import { ITEMS_PER_PAGE, TEXTURES, HABITATS, CHARACTERS, RARITIES } from '../constants';
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
  const [rarityFilter, setRarityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');


  const filteredMonsters = useMemo(() => {
    setCurrentPage(1);
    return monsters.filter(monster => {
        if (monster.textGenerationStatus !== 1) return true; // Always show generating/failed cards
        const nameMatch = monster.name.toLowerCase().includes(searchTerm.toLowerCase());
        const textureMatch = textureFilter === '' || monster.criteria.textures.includes(textureFilter);
        const habitatMatch = habitatFilter === '' || monster.criteria.habitat === habitatFilter;
        const characterMatch = characterFilter === '' || monster.criteria.character === characterFilter;
        const rarityMatch = rarityFilter === '' || monster.rarity === rarityFilter;
        return nameMatch && textureMatch && habitatMatch && characterMatch && rarityMatch;
    });
  }, [monsters, searchTerm, textureFilter, habitatFilter, characterFilter, rarityFilter]);
  
  const sortedAndFilteredMonsters = useMemo(() => {
      const sorted = [...filteredMonsters];
      sorted.sort((a, b) => {
          // Keep generating/failed cards at the top
          if (a.textGenerationStatus !== 1) return -1;
          if (b.textGenerationStatus !== 1) return 1;

          switch(sortBy) {
              case 'attack-desc': return b.attack - a.attack;
              case 'attack-asc': return a.attack - b.attack;
              case 'defense-desc': return b.defense - a.defense;
              case 'defense-asc': return a.defense - b.defense;
              case 'newest':
              default:
                  return 0; // Default order is already newest first from the store
          }
      });
      return sorted;
  }, [filteredMonsters, sortBy]);

  const paginatedMonsters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredMonsters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAndFilteredMonsters, currentPage]);


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
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <select value={textureFilter} onChange={e => setTextureFilter(e.target.value)} className={selectStyles}>
              <option value="">All Textures</option>
              {TEXTURES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select value={habitatFilter} onChange={e => setHabitatFilter(e.target.value)} className={selectStyles}>
              <option value="">All Habitats</option>
              {HABITATS.map(h => <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>)}
          </select>
          <select value={characterFilter} onChange={e => setCharacterFilter(e.target.value)} className={selectStyles}>
              <option value="">All Characters</option>
              {CHARACTERS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value)} className={selectStyles}>
              <option value="">All Rarities</option>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`${selectStyles} lg:col-start-5`}>
              <option value="newest">Sort: Newest First</option>
              <option value="attack-desc">Sort: Attack (High-Low)</option>
              <option value="attack-asc">Sort: Attack (Low-High)</option>
              <option value="defense-desc">Sort: Defense (High-Low)</option>
              <option value="defense-asc">Sort: Defense (Low-High)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedMonsters.map(monster => (
          <MonsterCard key={monster.id} monster={monster} onSelect={() => onSelectMonster(monster.id)} />
        ))}
      </div>

      {sortedAndFilteredMonsters.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={sortedAndFilteredMonsters.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MonsterGrid;