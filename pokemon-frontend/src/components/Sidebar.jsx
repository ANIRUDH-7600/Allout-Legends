// pokemon-frontend/src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import ProfilePanel from './panels/ProfilePanel';
import './Sidebar.css';

export default function Sidebar({ player, party, onSectionChange, activeSection }) {
  const [currentAvatar, setCurrentAvatar] = useState(() => {
    return localStorage.getItem('selected_avatar') || '/assets/heros/Alpha_Coder.png';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentAvatar(localStorage.getItem('selected_avatar') || '/assets/heros/Alpha_Coder.png');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAvatarChange = (newAvatar) => {
    setCurrentAvatar(newAvatar);
  };

  const sections = [
    { id: 'profile',    icon: '👤', label: 'Profile',   color: '#4caf50' },
    { id: 'pokemons',  icon: '⚡', label: 'Pokémons',  color: '#f44336', badge: party?.length || 0 },
    { id: 'battle',    icon: '⚔️', label: 'Battle',    color: '#ff9800' },
    { id: 'trade',     icon: '🔄', label: 'Trade',     color: '#2196f3' },
    { id: 'tasks',     icon: '📋', label: 'Tasks',     color: '#9c27b0' },
    { id: 'misc',      icon: '🎮', label: 'Misc',      color: '#607d8b' },
    { id: 'inventory', icon: '🎒', label: 'Inventory', color: '#795548', badge: 0 },
  ];

  const getRealmNumber = () => {
    if (player?.mapId === 'map1') return 1;
    if (player?.mapId === 'map2') return 2;
    if (player?.mapId === 'map5') return 5;
    if (player?.mapId === 'map6') return 6;
    return 1;
  };

  const handleSectionClick = (id) => {
    // Toggle off if already active
    onSectionChange(activeSection === id ? null : id);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfilePanel player={player} onAvatarChange={handleAvatarChange} />;
      case 'pokemons':
        return (
          <div className="section-panel">
            <h3>⚡ Your Pokémons</h3>
            <div className="party-list">
              {party?.map((p, i) => (
                <div key={i} className="party-member">
                  <span className="party-icon">⚡</span>
                  <span className="party-name">{p.name}</span>
                  <span className="party-level">Lv.{p.level}</span>
                  <div className="party-hp">
                    <div className="party-hp-fill" style={{ width: `${(p.hp / p.maxHp) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'battle':
        return (
          <div className="section-panel">
            <h3>⚔️ Battle Records</h3>
            <div className="battle-stats">
              <p>Wins: 0</p>
              <p>Losses: 0</p>
              <p>Pokémon Defeated: 0</p>
            </div>
          </div>
        );
      case 'trade':
        return (
          <div className="section-panel">
            <h3>🔄 Trade Center</h3>
            <p>Coming soon...</p>
          </div>
        );
      case 'tasks':
        return (
          <div className="section-panel">
            <h3>📋 Daily Tasks</h3>
            <div className="task-list">
              <div className="task-item">🏆 Catch 5 Pokémon — 0/5</div>
              <div className="task-item">⚔️ Win 3 battles — 0/3</div>
              <div className="task-item">🗺️ Explore a new realm — 0/1</div>
            </div>
          </div>
        );
      case 'misc':
        return (
          <div className="section-panel">
            <h3>🎮 Settings</h3>
            <div className="settings-list">
              <label className="setting-item">
                <span>🔊 Sound Effects</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="setting-item">
                <span>🎵 Music</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="setting-item">
                <span>📺 Fullscreen</span>
                <input type="checkbox" />
              </label>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="section-panel">
            <h3>🎒 Inventory</h3>
            <div className="inventory-list">
              <p>Poké Balls: 5</p>
              <p>Potions: 3</p>
              <p>Revives: 1</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Icon rail — always 56px, never pushes layout */}
      <div className="game-sidebar">
        <div className="sidebar-content">
          {sections.map(section => (
            <button
              key={section.id}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => handleSectionClick(section.id)}
              title={section.label}
              style={{ '--accent-color': section.color }}
            >
              <span className="sidebar-icon">{section.icon}</span>
              {section.badge > 0 && (
                <span className="sidebar-badge">{section.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-player">
            <div
              className="player-avatar-mini"
              title={`Trainer — Realm ${getRealmNumber()}`}
              onClick={() => handleSectionClick('profile')}
            >
              <img
                src={currentAvatar}
                alt="Player"
                onError={(e) => { e.target.src = '/assets/heros/Alpha_Coder.png'; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay panel — slides over content, no layout push */}
      <div className="section-content-area">
        {renderContent()}
      </div>
    </>
  );
}