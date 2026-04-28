// pokemon-frontend/src/components/TileViewer.jsx
import { useState } from 'react';
import { MASTER_TILESET, getTileStyle } from '../data/masterTileset';
import { isTileWalkable } from '../data/tileWalkability';

export default function TileViewer({ onClose, onSelectTile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTileset, setSelectedTileset] = useState('all');
  const [zoom, setZoom] = useState(1);
  
  // Get all tilesets
  const tilesets = MASTER_TILESET.tilesets;
  
  // Generate all tile IDs
  const allTiles = [];
  tilesets.forEach(tileset => {
    for (let id = tileset.startId; id <= tileset.endId; id++) {
      allTiles.push({
        id: id,
        tileset: tileset.id,
        name: tileset.name,
        walkable: isTileWalkable(id),
        encounterRate: tileset.encounterRate
      });
    }
  });
  
  // Filter tiles
  const filteredTiles = allTiles.filter(tile => {
    if (selectedTileset !== 'all' && tile.tileset !== selectedTileset) return false;
    if (searchTerm && !tile.id.toString().includes(searchTerm)) return false;
    return true;
  });
  
  const handleTileClick = (tileId) => {
    if (onSelectTile) {
      onSelectTile(tileId);
    }
    // Copy ID to clipboard
    navigator.clipboard.writeText(tileId.toString());
    alert(`Tile ID ${tileId} copied to clipboard!`);
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#1a1a2e',
        borderRadius: '10px',
        padding: '20px',
        color: '#fff'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h2 style={{ margin: 0 }}>🎨 Tile ID Viewer</h2>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                border: '1px solid #333',
                background: '#2a2a3e',
                color: '#fff'
              }}
            />
            
            <select
              value={selectedTileset}
              onChange={(e) => setSelectedTileset(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                background: '#2a2a3e',
                color: '#fff',
                border: '1px solid #333'
              }}
            >
              <option value="all">All Tilesets ({allTiles.length} tiles)</option>
              {tilesets.map(ts => (
                <option key={ts.id} value={ts.id}>
                  {ts.name} ({ts.startId}-{ts.endId})
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.25))}
              style={buttonStyle}
            >
              🔍 Zoom In
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              style={buttonStyle}
            >
              🔍 Zoom Out
            </button>
            <button
              onClick={onClose}
              style={{ ...buttonStyle, background: '#d32f2f' }}
            >
              ✖ Close
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          padding: '10px',
          background: '#2a2a3e',
          borderRadius: '5px',
          flexWrap: 'wrap'
        }}>
          <div>📊 Total Tiles: {allTiles.length}</div>
          <div>📁 Tilesets: {tilesets.length}</div>
          <div>🔍 Showing: {filteredTiles.length} tiles</div>
          <div>💡 Click any tile to copy its ID</div>
        </div>
        
        {/* Tile Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${100 * zoom}px, auto))`,
          gap: '10px',
          justifyContent: 'center'
        }}>
          {filteredTiles.map(tile => {
            const tileStyle = getTileStyle(tile.id, 64 * zoom);
            return (
              <div
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '10px',
                  background: '#2a2a3e',
                  borderRadius: '8px',
                  transition: 'transform 0.2s',
                  border: tile.walkable ? '2px solid #4caf50' : '2px solid #f44336',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div
                  style={{
                    ...tileStyle,
                    margin: '0 auto',
                    pointerEvents: 'none'
                  }}
                />
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  ID: {tile.id}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: tile.walkable ? '#4caf50' : '#f44336'
                }}>
                  {tile.walkable ? '🚶 Walkable' : '🚫 Blocked'}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: '#888'
                }}>
                  {tile.tileset}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Instructions */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#2a2a3e',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>📖 How to use:</strong><br />
          • Click any tile to copy its ID to clipboard<br />
          • Paste the ID in the game's "Tile ID" input field<br />
          • Press 'P' to enter paint mode and start painting!<br />
          • Green border = Walkable | Red border = Blocked
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '5px',
  border: 'none',
  background: '#4caf50',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '14px'
};