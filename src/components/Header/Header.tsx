import React, { useState } from 'react';

interface NavPill {
  id: string;
  label: string;
  icon: string;
}

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navPills: NavPill[] = [
    { id: 'incidents', label: 'Current Incidents', icon: '🔥' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'resources', label: 'Resources', icon: '📋' },
    { id: 'staffing', label: 'Staffing', icon: '👥' },
    { id: 'command', label: 'Command', icon: '⚡' },
    { id: 'training', label: 'Training', icon: '🎓' },
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-slate-800 text-xl">
              MFD
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Marin County Fire Services</h1>
              <p className="text-sm opacity-90">
                Operations Dashboard • Last Updated: <span id="lastUpdated">Loading...</span>
              </p>
            </div>
          </div>
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              className="w-full py-2 px-4 pr-10 rounded-full text-slate-800 bg-white/90 placeholder-gray-600 text-sm"
              placeholder="Search resources, incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800"
            >
              🔍
            </button>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {navPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => onSectionChange(pill.id)}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300
                ${activeSection === pill.id
                  ? 'bg-blue-500'
                  : 'bg-slate-700 hover:bg-blue-500'
                }
              `}
            >
              {pill.icon} {pill.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;