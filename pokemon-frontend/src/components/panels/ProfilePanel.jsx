// pokemon-frontend/src/components/panels/ProfilePanel.jsx
import { useState } from 'react';
import './Panel.css';

export default function ProfilePanel({ player, onAvatarChange }) {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('selected_avatar') || '/assets/heros/Alpha_Coder.png';
  });

  const avatars = [
    {
      id: 'ace_stalker',
      name: 'Ace Stalker',
      path: '/assets/heros/Ace_Stalker.png',
      rarity: 'epic',
      description: 'Tracks targets across all realms',
    },
    {
      id: 'alpha_coder',
      name: 'Alpha Coder',
      path: '/assets/heros/Alpha_Coder.png',
      rarity: 'legendary',
      description: 'Master of the digital realm',
    },
    {
      id: 'bamboo_hunter',
      name: 'Bamboo Hunter',
      path: '/assets/heros/Bamboo_Hunter.png',
      rarity: 'rare',
      description: 'Silent as forest, swift as storm',
    },
    {
      id: 'love_seeker',
      name: 'Love Seeker',
      path: '/assets/heros/Love_Seeker.png',
      rarity: 'rare',
      description: 'Fights with heart and soul',
    },
    {
      id: 'rizz_cr',
      name: 'Rizz CR',
      path: '/assets/heros/Rizz_CR.png',
      rarity: 'epic',
      description: 'Charms even wild Pokémon',
    },
  ];

  const getRealmNumber = () => {
    const map = { map1: 1, map2: 2, map5: 5, map6: 6 };
    return map[player?.mapId] ?? 1;
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.path);
    localStorage.setItem('selected_avatar', avatar.path);
    if (onAvatarChange) onAvatarChange(avatar.path);
    setShowAvatarModal(false);
  };

  const menuItems = [
    { id: 'activity',     label: 'Account Activity',   icon: '📊' },
    { id: 'online',       label: 'Online Trainers',    icon: '🟢' },
    { id: 'leaderboards', label: 'Leaderboards',        icon: '🏆' },
    { id: 'search',       label: 'Search Users',       icon: '🔍' },
    { id: 'friends',      label: 'Friends & Blocklist', icon: '👥' },
    { id: 'messages',     label: 'Messages',           icon: '💬', badge: 3 },
    { id: 'pokemart',     label: 'PokéMart',           icon: '🏪' },
    { id: 'events',       label: 'Events',             icon: '🎪', badge: 1 },
  ];

  return (
    <div className="profile-panel">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="profile-header">
        <div className="profile-avatar-row">
          <div className="profile-avatar-large">
            <img
              src={selectedAvatar}
              alt="Trainer avatar"
              onError={(e) => { e.target.src = '/assets/heros/Alpha_Coder.png'; }}
            />
            <div className="avatar-status" title="Online" />
            <button
              className="avatar-change-btn"
              onClick={() => setShowAvatarModal(true)}
            >
              Change
            </button>
          </div>

          <div className="profile-info-large">
            <p className="trainer-label">Trainer</p>
            <h3>Trainer</h3>

            <div className="profile-stats">
              <span className="stat-row">
                <span>⭐</span>
                <span className="stat-row-value">Level 1</span>
              </span>
              <span className="stat-row">
                <span>📍</span>
                <span className="stat-row-value">Realm {getRealmNumber()}</span>
              </span>
            </div>

            <div className="profile-progress">
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: '15%' }} />
              </div>
              <div className="xp-text">
                <span>150 XP</span>
                <span>1000 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ────────────────────────────────────── */}
      <div className="quick-stats">
        <div className="quick-stat">
          <span className="quick-stat-value">0</span>
          <span className="quick-stat-label">Wins</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value">{player?.party?.length ?? 0}</span>
          <span className="quick-stat-label">Party</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value">0</span>
          <span className="quick-stat-label">Badges</span>
        </div>
      </div>

      {/* ── MENU ───────────────────────────────────────────── */}
      <p className="menu-section-label">Navigation</p>
      <div className="profile-dropdown-container">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="profile-dropdown-item"
            onClick={() => console.log(item.label)}
          >
            <span className="dropdown-icon">{item.icon}</span>
            <span className="dropdown-label">{item.label}</span>
            {item.badge && (
              <span className="dropdown-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── AVATAR MODAL ───────────────────────────────────── */}
      {showAvatarModal && (
        <div
          className="avatar-modal-overlay"
          onClick={() => setShowAvatarModal(false)}
        >
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-modal-header">
              <h3>Select Hero</h3>
              <button
                className="close-modal"
                onClick={() => setShowAvatarModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="avatar-grid-scroll">
              <div className="avatar-grid">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`avatar-option ${selectedAvatar === avatar.path ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <img
                      src={avatar.path}
                      alt={avatar.name}
                      onError={(e) => { e.target.src = '/assets/heros/Alpha_Coder.png'; }}
                    />
                    <div className="avatar-name">{avatar.name}</div>
                    <div className={`avatar-rarity ${avatar.rarity}`}>
                      {avatar.rarity}
                    </div>
                    <div className="avatar-description">{avatar.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="avatar-modal-footer">
              <p>More heroes unlock as you progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}