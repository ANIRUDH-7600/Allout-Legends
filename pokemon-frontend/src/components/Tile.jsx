// pokemon-frontend/src/components/Tile.jsx
import { getTileStyle } from "../data/masterTileset";

export default function Tile({ type, onClick, onContextMenu, onMouseEnter, onMouseLeave, title, tileScale }) {
  const scale = tileScale ?? 1;
  const baseStyle = getTileStyle(type, 40);

  if (!baseStyle || Object.keys(baseStyle).length === 0) {
    return (
      <div
        className="tile"
        style={{ width: "40px", height: "40px", background: "#333", border: "1px solid #555" }}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={title || `Unknown tile: ${type}`}
      />
    );
  }

  if (scale >= 1) {
    return (
      <div
        className="tile"
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={title || `Tile ID: ${type}`}
        style={baseStyle}
      />
    );
  }

  return (
    <div
      className="tile"
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={title || `Tile ID: ${type} (scale: ${Math.round(scale * 100)}%)`}
      style={{
        width: "40px",
        height: "40px",
        position: "relative",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div
        style={{
          ...baseStyle,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}