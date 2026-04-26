// pokemon-frontend/src/components/Tile.jsx

import { getTileStyle } from "../data/masterTileset";

export default function Tile({ type, onClick, onContextMenu, title }) {
  const tileStyle = getTileStyle(type, 64);
  
  if (!tileStyle || Object.keys(tileStyle).length === 0) {
    return (
      <div
        className="tile"
        style={{
          width: "64px",
          height: "64px",
          background: "#333",
          border: "1px solid #555",
        }}
        onClick={onClick}
        onContextMenu={onContextMenu}
        title={title || `Unknown tile: ${type}`}
      />
    );
  }
  
  return (
    <div
      className="tile"
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={title || `Tile ID: ${type}`}
      style={tileStyle}
    />
  );
}