// pokemon-frontend/src/components/panels/ProfilePanel.jsx
import { useState} from 'react';
import './Panel.css'

export default function ProfilePanel({ player, onAvatarChange }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('selected_avatar') || '/assets/heros/Alpha_Coder.png';
  });

  // Use correct path: /assets/heros/ (not heroes)
  const avatars = [
    { 
      id: 'ace_stalker', 
      name: 'Ace Stalker', 
      path: '/assets/heros/Ace_Stalker.png', 
      rarity: 'Epic',
      description: 'A mysterious tracker who never loses their target'
    },
    { 
      id: 'alpha_coder', 
      name: 'Alpha Coder', 
      path: '/assets/heros/Alpha_Coder.png', 
      rarity: 'Legendary',
      description: 'The master of the digital realm'
    },
    { 
      id: 'bamboo_hunter', 
      name: 'Bamboo Hunter', 
      path: '/assets/heros/Bamboo_Hunter.png', 
      rarity: 'Rare',
      description: 'Silent as the bamboo forest, deadly as the storm'
    },
    { 
      id: 'love_seeker', 
      name: 'Love Seeker', 
      path: '/assets/heros/Love_Seeker.png', 
      rarity: 'Rare',
      description: 'Fighting with the power of heart and soul'
    },
    { 
      id: 'rizz_cr', 
      name: 'Rizz CR', 
      path: '/assets/heros/Rizz_CR.png', 
      rarity: 'Epic',
      description: 'Charisma that charms even wild Pokémon'
    },
  ];

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Legendary': return '#ff9800';
      case 'Epic': return '#9c27b0';
      case 'Rare': return '#2196f3';
      default: return '#607d8b';
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.path);
    localStorage.setItem('selected_avatar', avatar.path);
    if (onAvatarChange) onAvatarChange(avatar.path);
    setActiveDropdown(null);
  };

  const dropdownItems = [
    { id: 'account', label: 'Account Activity', icon: '📊', action: () => console.log('Account Activity') },
    { id: 'online', label: 'Online Trainers', icon: '🟢', action: () => console.log('Online Trainers') },
    { id: 'leaderboards', label: 'Leaderboards', icon: '🏆', action: () => console.log('Leaderboards') },
    { id: 'search', label: 'Search Users', icon: '🔍', action: () => console.log('Search Users') },
    { id: 'friends', label: 'Friends & Blocklist', icon: '👥', action: () => console.log('Friends & Blocklist') },
    { id: 'messages', label: 'Messages', icon: '💬', action: () => console.log('Messages'), badge: 3 },
    { id: 'pokemart', label: 'PokeMart', icon: '🏪', action: () => console.log('PokeMart') },
    { id: 'events', label: 'Events', icon: '🎪', action: () => console.log('Events'), badge: 1 },
  ];

  const MenuItem = ({ item, onClose }) => (
    <button 
      className="profile-dropdown-item"
      onClick={() => {
        item.action();
        onClose();
      }}
    >
      <span className="dropdown-icon">{item.icon}</span>
      <span className="dropdown-label">{item.label}</span>
      {item.badge && <span className="dropdown-badge">{item.badge}</span>}
    </button>
  );

  return (
    <div className="profile-panel">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <img 
            src={selectedAvatar} 
            alt="Player Avatar"
            onError={(e) => {
              e.target.src = '/assets/heros/Alpha_Coder.png';
            }}
          />
          <button 
            className="avatar-change-btn"
            onClick={() => setActiveDropdown(activeDropdown === 'avatar' ? null : 'avatar')}
          >
            🎨 Change Skin
          </button>
        </div>
        <div className="profile-info-large">
          <h3>Trainer</h3>
          <div className="profile-stats">
            <span>⭐ Level 1</span>
            <span>📍 Realm {player?.mapId === 'map1' ? 1 : player?.mapId === 'map2' ? 2 : player?.mapId === 'map5' ? 5 : 6}</span>
          </div>
          <div className="profile-progress">
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: '15%' }}></div>
            </div>
            <span className="xp-text">150 / 1000 XP</span>
          </div>
        </div>
      </div>

      <div className="profile-dropdown-container">
        {dropdownItems.map(item => (
          <MenuItem key={item.id} item={item} onClose={() => setActiveDropdown(null)} />
        ))}
      </div>

      {activeDropdown === 'avatar' && (
        <div className="avatar-modal-overlay" onClick={() => setActiveDropdown(null)}>
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-modal-header">
              <h3>🎨 Choose Your Hero</h3>
              <button className="close-modal" onClick={() => setActiveDropdown(null)}>✖</button>
            </div>
            <div className="avatar-grid">
              {avatars.map(avatar => (
                <div 
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar === avatar.path ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <img 
                    src={avatar.path} 
                    alt={avatar.name}
                    onError={(e) => {
                      e.target.src = '/assets/heros/Alpha_Coder.png';
                    }}
                  />
                  <div className="avatar-name">{avatar.name}</div>
                  <div 
                    className="avatar-rarity" 
                    style={{ background: getRarityColor(avatar.rarity) }}
                  >
                    {avatar.rarity}
                  </div>
                  <div className="avatar-description">{avatar.description}</div>
                </div>
              ))}
            </div>
            <div className="avatar-modal-footer">
              <p>💡 Select your hero to show in the game world!</p>
              <p>✨ More heroes will be available in future updates</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}