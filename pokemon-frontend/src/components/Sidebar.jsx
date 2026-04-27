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
      setCurrentAvatar(
        localStorage.getItem('selected_avatar') || '/assets/heros/Alpha_Coder.png'
      );
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAvatarChange = (newAvatar) => setCurrentAvatar(newAvatar);

  const sections = [
    { id: 'profile',    icon: '👤', label: 'Profile'   },
    { id: 'pokemons',  icon: '⚡', label: 'Pokémons',  badge: party?.length || 0 },
    { id: 'battle',    icon: '⚔️', label: 'Battle'    },
    { id: 'trade',     icon: '🔄', label: 'Trade'     },
    { id: 'tasks',     icon: '📋', label: 'Tasks'     },
    { id: 'misc',      icon: '🎮', label: 'Settings'  },
    { id: 'inventory', icon: '🎒', label: 'Inventory', badge: 0 },
  ];

  const getRealmNumber = () => {
    const map = { map1: 1, map2: 2, map5: 5, map6: 6 };
    return map[player?.mapId] ?? 1;
  };

  const handleSectionClick = (id) => {
    onSectionChange(activeSection === id ? null : id);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfilePanel player={player} onAvatarChange={handleAvatarChange} />;

      case 'pokemons':
        return (
          <div className="section-panel">
            <h3>Pokémons</h3>
            <div className="party-list">
              {party?.map((p, i) => (
                <div key={i} className="party-member">
                  <span className="party-icon">⚡</span>
                  <span className="party-name">{p.name}</span>
                  <span className="party-level">LV{p.level}</span>
                  <div className="party-hp">
                    <div
                      className="party-hp-fill"
                      style={{ width: `${(p.hp / p.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'battle':
        return (
          <div className="section-panel">
            <h3>Battle Records</h3>
            <div className="battle-stats">
              <p>Wins <span>0</span></p>
              <p>Losses <span>0</span></p>
              <p>Pokémon Defeated <span>0</span></p>
            </div>
          </div>
        );

      case 'trade':
        return (
          <div className="section-panel">
            <h3>Trade Center</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 9 }}>
              Coming soon...
            </p>
          </div>
        );

      case 'tasks':
        return (
          <div className="section-panel">
            <h3>Daily Tasks</h3>
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
            <h3>Settings</h3>
            <div className="settings-list">
              <label className="setting-item">
                <span>Sound Effects</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="setting-item">
                <span>Music</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="setting-item">
                <span>Fullscreen</span>
                <input type="checkbox" />
              </label>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="section-panel">
            <h3>Inventory</h3>
            <div className="inventory-list">
              <p>Poké Balls <span>5</span></p>
              <p>Potions <span>3</span></p>
              <p>Revives <span>1</span></p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Icon rail */}
      <div className="game-sidebar">
        <div className="sidebar-content">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => handleSectionClick(section.id)}
              title={section.label}
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

      {/* Slide-out panel */}
      <div className="section-content-area">
        {renderContent()}
      </div>
    </>
  );
}