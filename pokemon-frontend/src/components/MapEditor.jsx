// pokemon-frontend/src/components/MapEditor.jsx
import { useState } from "react";
import { clampTileId, TILESET_MAX_ID } from "../data/tilesetMeta";
import TileViewer from "./TileViewer";

export default function MapEditor({
  paintMode,
  setPaintMode,
  selectedTileId,
  setSelectedTileId,
  handleSaveToLocalStorage,
  handleLoadFromLocalStorage,
  handleResetAllData,
  handleExportToFile,
  handleImportFromFile,
  handleExportOverrides,
  clearPaintLogForCurrentMap,
  exportStatus,
  fillStart,
  currentPaintLines,
  currentMap,
  mapNames,
  player,
  terrainName,
  totalSavedEdits,
  pressedKey,
  handleDpad
}) {
  const [showTileViewer, setShowTileViewer] = useState(false);

  const handleTileSelect = (tileId) => {
    setSelectedTileId(tileId);
    setShowTileViewer(false);
  };

  return (
    <aside className="deluge-panel">
      <div className="search-panel">
        <p className="search-message">Couldn't find anything.</p>
        <p className="search-message">Try moving to another spot.</p>
      </div>

      <div className="panel-meta">
        <div className="meta-row">
          <span className="meta-label">Area</span>
          <span className="meta-value">{mapNames[currentMap]}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Pos</span>
          <span className="meta-value">({player.x}, {player.y})</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Terrain</span>
          <span className="meta-value">{terrainName}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Saved Edits</span>
          <span className="meta-value" style={{ color: totalSavedEdits > 0 ? "#43a047" : "#999" }}>
            {totalSavedEdits} tiles
          </span>
        </div>
      </div>

      <div className="controls-pad">
        <div className="pad-grid">
          <button
            className={`pad-btn up ${pressedKey === "ArrowUp" ? "pressed" : ""}`}
            onClick={() => handleDpad("up")}
            aria-label="Move up"
          ></button>
          <button
            className={`pad-btn left ${pressedKey === "ArrowLeft" ? "pressed" : ""}`}
            onClick={() => handleDpad("left")}
            aria-label="Move left"
          ></button>
          <div className="pad-center">
            <img src="/assets/heros/Alpha%20Coder.png" alt="Player icon" />
          </div>
          <button
            className={`pad-btn right ${pressedKey === "ArrowRight" ? "pressed" : ""}`}
            onClick={() => handleDpad("right")}
            aria-label="Move right"
          ></button>
          <button
            className={`pad-btn down ${pressedKey === "ArrowDown" ? "pressed" : ""}`}
            onClick={() => handleDpad("down")}
            aria-label="Move down"
          ></button>
        </div>
      </div>

      <label className="keyboard-toggle">
        <input type="checkbox" checked readOnly />
        Enable Keyboard Navigation?
      </label>

      <div className="paint-tools">
        <div className="paint-row">
          <span className="meta-label">Paint</span>
          <button
            type="button"
            className={`paint-toggle ${paintMode ? "on" : ""}`}
            onClick={() => setPaintMode((prev) => !prev)}
          >
            {paintMode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="paint-row">
          <span className="meta-label">Tile ID</span>
          <input
            className="paint-input"
            type="number"
            min={0}
            max={TILESET_MAX_ID}
            value={selectedTileId}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) {
                setSelectedTileId(clampTileId(next));
              }
            }}
          />
        </div>

        {/* Browse Tiles Button */}
        <div className="paint-row">
          <button
            type="button"
            className="paint-action-btn"
            onClick={() => setShowTileViewer(true)}
            style={{ background: "#9c27b0", color: "white", width: "100%" }}
          >
            🖼️ Browse Tiles
          </button>
        </div>

        {/* Save/Load/Reset Buttons */}
        <div className="paint-row">
          <button
            type="button"
            className="paint-action-btn"
            onClick={handleSaveToLocalStorage}
            style={{ background: "#43a047", color: "white", fontWeight: "bold" }}
          >
            💾 SAVE
          </button>
          <button
            type="button"
            className="paint-action-btn"
            onClick={handleLoadFromLocalStorage}
          >
            📂 LOAD
          </button>
          <button
            type="button"
            className="paint-action-btn"
            onClick={handleResetAllData}
            style={{ background: "#d32f2f", color: "white" }}
          >
            🗑 RESET
          </button>
        </div>

        {/* Git/PR Friendly Import/Export Buttons */}
        <div className="paint-row">
          <button
            type="button"
            className="paint-action-btn"
            onClick={handleExportToFile}
            style={{ background: "#2196f3", color: "white" }}
          >
            📁 Export File
          </button>
          <button
            type="button"
            className="paint-action-btn"
            onClick={handleImportFromFile}
            style={{ background: "#ff9800", color: "white" }}
          >
            📂 Import File
          </button>
        </div>

        <div className="paint-hint">Press P to toggle, [ / ] to change ID, click map to paint.</div>
        <div className="paint-hint">Shift+click = rectangle fill. Right-click = erase to id 0.</div>
        <div className="paint-hint">💾 Click SAVE to persist edits (Ctrl+S shortcut)</div>
        <div className="paint-hint">📁 Export File = share map via Git/PR | 📂 Import File = load from PR</div>
        <div className="paint-hint">🖼️ Browse Tiles = see all tiles with IDs</div>
        {fillStart && <div className="paint-hint">Fill start: ({fillStart.x}, {fillStart.y})</div>}
        
        <div className="paint-actions">
          <button type="button" className="paint-action-btn" onClick={handleExportOverrides}>Export Code</button>
          <button type="button" className="paint-action-btn" onClick={clearPaintLogForCurrentMap}>Clear Log</button>
        </div>
        
        {exportStatus && (
          <div className="paint-hint" style={{ 
            color: exportStatus.includes("✅") ? "#43a047" : 
                   exportStatus.includes("❌") ? "#d32f2f" : 
                   exportStatus.includes("📁") ? "#2196f3" : "#ffa000" 
          }}>
            {exportStatus}
          </div>
        )}
        
        <pre className="paint-output">{currentPaintLines || "// no edits yet"}</pre>
      </div>

      {showTileViewer && (
        <TileViewer 
          onClose={() => setShowTileViewer(false)}
          onSelectTile={handleTileSelect}
        />
      )}
    </aside>
  );
}