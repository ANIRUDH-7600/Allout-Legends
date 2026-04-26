import { useState, useEffect, useCallback, useMemo } from "react";
import Map from "./Map";
import Battle from "./Battle";
import { maps } from "../data/maps";
import { clampTileId, TILESET_MAX_ID } from "../data/tilesetMeta";
import { movePlayer } from "../logic/movement";
import { checkEncounter } from "../logic/encounter";

const TILE = 64;
const VIEWPORT_W = 640;
const VIEWPORT_H = 480;
const SIDE_GATE_Y_MIN = 14;
const SIDE_GATE_Y_MAX = 15;
const VERTICAL_GATE_X_MIN = 14;
const VERTICAL_GATE_X_MAX = 15;

// localStorage keys
const STORAGE_KEYS = {
  PAINT_LOG: "allout_legends_paint_log",
  CURRENT_MAP: "allout_legends_current_map",
  PLAYER_POS: "allout_legends_player_pos",
};

function isAtSideGate(y) {
  return y >= SIDE_GATE_Y_MIN && y <= SIDE_GATE_Y_MAX;
}

function isAtVerticalGate(x) {
  return x >= VERTICAL_GATE_X_MIN && x <= VERTICAL_GATE_X_MAX;
}

// Helper: Load saved paint log from localStorage
function loadSavedPaintLog() {
  const saved = localStorage.getItem(STORAGE_KEYS.PAINT_LOG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load paint log:", e);
      return { map1: [], map2: [], map5: [], map6: [] };
    }
  }
  return { map1: [], map2: [], map5: [], map6: [] };
}

// Helper: Apply saved overrides to maps
function applySavedOverridesToMaps(savedLog) {
  Object.keys(savedLog).forEach(mapName => {
    const overrides = savedLog[mapName];
    if (overrides && maps[mapName]) {
      overrides.forEach(({ x, y, id }) => {
        if (maps[mapName][y] && maps[mapName][y][x] !== undefined) {
          maps[mapName][y][x] = id;
        }
      });
    }
  });
}

export default function Game() {
  // Load saved player position OR default to { x: 2, y: 2 }
  const getInitialPlayerPos = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_POS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { x: 2, y: 2 };
      }
    }
    return { x: 2, y: 2 };
  };

  const getInitialCurrentMap = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_MAP);
    return saved && (saved === "map1" || saved === "map2" || saved === "map5" || saved === "map6") 
      ? saved 
      : "map1";
  };

  const [player, setPlayer] = useState(getInitialPlayerPos);
  const [gameState, setGameState] = useState("map");
  const [currentMap, setCurrentMap] = useState(getInitialCurrentMap);
  const [pressedKey, setPressedKey] = useState(null);
  const [transition, setTransition] = useState(false);
  const [paintMode, setPaintMode] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState(0);
  const [fillStart, setFillStart] = useState(null);
  const [exportStatus, setExportStatus] = useState("");
  
  // Load saved paint log on startup
  const [paintLog, setPaintLog] = useState(() => {
    const savedLog = loadSavedPaintLog();
    // Apply saved overrides to maps immediately
    applySavedOverridesToMaps(savedLog);
    return savedLog;
  });
  
  const current = maps[currentMap];

  // Save player position whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_POS, JSON.stringify(player));
  }, [player]);

  // Save current map whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MAP, currentMap);
  }, [currentMap]);

  const camera = useMemo(() => {
    const mapW = current[0].length * TILE;
    const mapH = current.length * TILE;
    const cx = Math.max(0, Math.min(player.x * TILE - VIEWPORT_W / 2, mapW - VIEWPORT_W));
    const cy = Math.max(0, Math.min(player.y * TILE - VIEWPORT_H / 2, mapH - VIEWPORT_H));
    return { x: cx, y: cy };
  }, [player, current]);

  // Handle movement
  const handleMove = useCallback((key) => {
    if (gameState !== "map") return;
    if (paintMode) return;

    const rightEdge = current[0].length - 2;
    const bottomEdge = current.length - 2;
    const atSideGate = isAtSideGate(player.y);
    const atVerticalGate = isAtVerticalGate(player.x);

    // Map transitions
    if (player.x === rightEdge && key === "ArrowRight" && atSideGate) {
      if (currentMap === "map1") {
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map2");
          setPlayer({ x: 2, y: player.y });
          setTransition(false);
        }, 300);
      } else if (currentMap === "map5") {
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map6");
          setPlayer({ x: 2, y: player.y });
          setTransition(false);
        }, 300);
      }
      return;
    }

    if (player.x === 1 && key === "ArrowLeft" && atSideGate) {
      if (currentMap === "map6") {
        const nextMap = maps.map5;
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map5");
          setPlayer({ x: nextMap[0].length - 2, y: player.y });
          setTransition(false);
        }, 300);
      } else if (currentMap === "map2") {
        const nextMap = maps.map1;
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map1");
          setPlayer({ x: nextMap[0].length - 2, y: player.y });
          setTransition(false);
        }, 300);
      }
      return;
    }

    if (player.y === bottomEdge && key === "ArrowDown" && atVerticalGate) {
      if (currentMap === "map1") {
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map5");
          setPlayer({ x: player.x, y: 2 });
          setTransition(false);
        }, 300);
      } else if (currentMap === "map2") {
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map6");
          setPlayer({ x: player.x, y: 2 });
          setTransition(false);
        }, 300);
      }
      return;
    }

    if (player.y === 1 && key === "ArrowUp" && atVerticalGate) {
      if (currentMap === "map5") {
        const nextMap = maps.map1;
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map1");
          setPlayer({ x: player.x, y: nextMap.length - 2 });
          setTransition(false);
        }, 300);
      } else if (currentMap === "map6") {
        const nextMap = maps.map2;
        setTransition(true);
        setTimeout(() => {
          setCurrentMap("map2");
          setPlayer({ x: player.x, y: nextMap.length - 2 });
          setTransition(false);
        }, 300);
      }
      return;
    }

    const newPos = movePlayer(player, key, current);
    if (newPos.x !== player.x || newPos.y !== player.y) {
      setPlayer(newPos);
      if (checkEncounter(newPos.x, newPos.y, current)) {
        setGameState("battle");
      }
    }
  }, [player, gameState, currentMap, current, paintMode]);

  const handleTilePaint = useCallback((x, y, options = { action: "paint", shiftKey: false }) => {
    if (!paintMode) return;
    if (!current[y] || current[y][x] === undefined) return;

    const upsertEntries = (entries) => {
      setPaintLog((prev) => {
        const list = [...(prev[currentMap] || [])];
        entries.forEach((nextEntry) => {
          const existingIndex = list.findIndex((entry) => entry.x === nextEntry.x && entry.y === nextEntry.y);
          if (existingIndex >= 0) {
            list[existingIndex] = nextEntry;
          } else {
            list.push(nextEntry);
          }
        });

        const newLog = {
          ...prev,
          [currentMap]: list,
        };
        
        return newLog;
      });
    };

    if (options.action === "erase") {
      const eraseId = 0;
      maps[currentMap][y][x] = eraseId;
      upsertEntries([{ x, y, id: eraseId }]);
      setFillStart(null);
      console.log(`[${x}, ${y}, ${eraseId}],`);
      return;
    }

    const clampedTileId = clampTileId(selectedTileId);

    if (options.shiftKey) {
      if (!fillStart) {
        setFillStart({ x, y });
        setExportStatus(`Fill start set at (${x}, ${y})`);
        return;
      }

      const minX = Math.min(fillStart.x, x);
      const maxX = Math.max(fillStart.x, x);
      const minY = Math.min(fillStart.y, y);
      const maxY = Math.max(fillStart.y, y);
      const entries = [];

      for (let yy = minY; yy <= maxY; yy++) {
        for (let xx = minX; xx <= maxX; xx++) {
          if (maps[currentMap][yy] && maps[currentMap][yy][xx] !== undefined) {
            maps[currentMap][yy][xx] = clampedTileId;
            entries.push({ x: xx, y: yy, id: clampedTileId });
          }
        }
      }

      upsertEntries(entries);
      setFillStart(null);
      setExportStatus(`Filled ${entries.length} tiles with id ${clampedTileId}`);
      return;
    }

    maps[currentMap][y][x] = clampedTileId;
    upsertEntries([{ x, y, id: clampedTileId }]);
    setFillStart(null);

    console.log(`[${x}, ${y}, ${clampedTileId}],`);
  }, [paintMode, current, selectedTileId, currentMap, fillStart]);

  // Save all paint edits to localStorage permanently
  const handleSaveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAINT_LOG, JSON.stringify(paintLog));
      localStorage.setItem(STORAGE_KEYS.CURRENT_MAP, currentMap);
      localStorage.setItem(STORAGE_KEYS.PLAYER_POS, JSON.stringify(player));
      
      const totalEdits = Object.values(paintLog).reduce((sum, arr) => sum + arr.length, 0);
      setExportStatus(`✅ Saved ${totalEdits} tile edits to browser storage! (Will persist after refresh)`);
      
      setTimeout(() => {
        setExportStatus(prev => prev.includes("✅") ? "" : prev);
      }, 3000);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      setExportStatus("❌ Save failed! Storage may be full or disabled.");
    }
  }, [paintLog, currentMap, player]);

  // Load saved edits from localStorage (manual reload)
  const handleLoadFromLocalStorage = useCallback(() => {
    try {
      const savedLog = loadSavedPaintLog();
      
      Object.keys(savedLog).forEach(mapName => {
        const overrides = savedLog[mapName];
        if (overrides && maps[mapName]) {
          overrides.forEach(({ x, y, id }) => {
            if (maps[mapName][y] && maps[mapName][y][x] !== undefined) {
              maps[mapName][y][x] = id;
            }
          });
        }
      });
      
      setPaintLog(savedLog);
      setExportStatus(`📂 Loaded ${Object.values(savedLog).reduce((sum, arr) => sum + arr.length, 0)} saved edits!`);
      
      setTimeout(() => {
        setExportStatus(prev => prev.includes("📂") ? "" : prev);
      }, 3000);
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      setExportStatus("❌ Load failed!");
    }
  }, []);

  // Clear ALL saved data (reset everything)
  const handleResetAllData = useCallback(() => {
    if (window.confirm("⚠️ WARNING: This will delete ALL saved map edits and reset player position! This cannot be undone. Continue?")) {
      try {
        localStorage.removeItem(STORAGE_KEYS.PAINT_LOG);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_MAP);
        localStorage.removeItem(STORAGE_KEYS.PLAYER_POS);
        
        setPaintLog({ map1: [], map2: [], map5: [], map6: [] });
        setCurrentMap("map1");
        setPlayer({ x: 2, y: 2 });
        
        window.location.reload();
      } catch (error) {
        console.error("Failed to reset:", error);
        setExportStatus("❌ Reset failed!");
      }
    }
  }, []);

  // NEW: Export map edits as a downloadable JSON file (for sharing via Git/PR)
  const handleExportToFile = useCallback(() => {
    const totalEdits = Object.values(paintLog).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalEdits === 0) {
      setExportStatus("No edits to export. Paint some tiles first!");
      return;
    }
    
    const exportData = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      createdBy: "Allout-Legends Map Editor",
      edits: paintLog,
      metadata: {
        currentMap: currentMap,
        playerPos: player,
        totalEdits: totalEdits
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `allout_map_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setExportStatus(`📁 Exported ${totalEdits} tile edits to JSON file! Share this file via Git/PR.`);
    
    setTimeout(() => {
      setExportStatus(prev => prev.includes("📁") ? "" : prev);
    }, 4000);
  }, [paintLog, currentMap, player]);

  // NEW: Import map edits from a JSON file (from friend's PR/export)
  const handleImportFromFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          
          // Support both new format (with version) and legacy format
          let importedEdits;
          if (imported.version && imported.edits) {
            // New format with metadata
            importedEdits = imported.edits;
            setExportStatus(`📂 Importing map from ${new Date(imported.createdAt).toLocaleString()}`);
          } else if (imported.map1 || imported.map2 || imported.map5 || imported.map6) {
            // Legacy format (direct paintLog object)
            importedEdits = imported;
            setExportStatus(`📂 Importing legacy map file...`);
          } else {
            setExportStatus("❌ Invalid map file format");
            return;
          }
          
          // Apply imported edits to maps
          Object.keys(importedEdits).forEach(mapName => {
            const overrides = importedEdits[mapName];
            if (overrides && maps[mapName]) {
              overrides.forEach(({ x, y, id }) => {
                if (maps[mapName][y] && maps[mapName][y][x] !== undefined) {
                  maps[mapName][y][x] = id;
                }
              });
            }
          });
          
          setPaintLog(importedEdits);
          
          // Optionally restore player position if in metadata
          if (imported.metadata?.currentMap) {
            if (confirm("Also restore saved player position from this map file?")) {
              setCurrentMap(imported.metadata.currentMap);
              if (imported.metadata.playerPos) {
                setPlayer(imported.metadata.playerPos);
              }
            }
          }
          
          // Save to localStorage automatically
          localStorage.setItem(STORAGE_KEYS.PAINT_LOG, JSON.stringify(importedEdits));
          
          const totalEdits = Object.values(importedEdits).reduce((sum, arr) => sum + arr.length, 0);
          setExportStatus(`✅ Imported ${totalEdits} tile edits from ${file.name}! Click 💾 SAVE to make permanent.`);
          
          setTimeout(() => {
            setExportStatus(prev => prev.includes("✅") ? "" : prev);
          }, 4000);
        } catch (error) {
          console.error("Import failed:", error);
          setExportStatus("❌ Failed to import file. Make sure it's a valid map JSON.");
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }, []);

  const handleExportOverrides = useCallback(async () => {
    const entries = (paintLog[currentMap] || [])
      .slice()
      .sort((a, b) => (a.y - b.y) || (a.x - b.x));

    if (entries.length === 0) {
      setExportStatus("No paint edits to export.");
      return;
    }

    const block = `${currentMap}: [\n${entries.map((entry) => `  [${entry.x}, ${entry.y}, ${entry.id}],`).join("\n")}\n],`;

    try {
      await navigator.clipboard.writeText(block);
      setExportStatus("Copied override block to clipboard.");
    } catch {
      console.log(block);
      setExportStatus("Clipboard blocked. Block printed to console.");
    }
  }, [paintLog, currentMap]);

  const clearPaintLogForCurrentMap = useCallback(() => {
    setPaintLog((prev) => ({
      ...prev,
      [currentMap]: [],
    }));
    setExportStatus("Cleared paint log for this realm (placed tiles remain).");
    setFillStart(null);
  }, [currentMap]);

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPaintMode((prev) => !prev);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveToLocalStorage();
        return;
      }

      if (paintMode) {
        if (e.key === "[" || e.key === "-") {
          e.preventDefault();
          setSelectedTileId((prev) => Math.max(0, prev - 1));
          return;
        }

        if (e.key === "]" || e.key === "=") {
          e.preventDefault();
          setSelectedTileId((prev) => Math.min(TILESET_MAX_ID, prev + 1));
          return;
        }
      }

      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setPressedKey(e.key);
        handleMove(e.key);
      }
    };
    const onKeyUp = () => setPressedKey(null);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleMove, paintMode, handleSaveToLocalStorage]);

  // D-pad click handler
  const handleDpad = (dir) => {
    const keyMap = {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
    };
    setPressedKey(keyMap[dir]);
    handleMove(keyMap[dir]);
    setTimeout(() => setPressedKey(null), 150);
  };

  const mapNames = { map1: "Realm 1", map2: "Realm 2", map5: "Realm 5", map6: "Realm 6" };
  const currentPaintLines = (paintLog[currentMap] || [])
    .slice()
    .sort((a, b) => (a.y - b.y) || (a.x - b.x))
    .map((entry) => `[${entry.x}, ${entry.y}, ${entry.id}],`)
    .join("\n");

  const tileType = current[player.y]?.[player.x];
  const terrainName =
    tileType === 2 ? "Tall Grass" :
    tileType === 1 ? "Rock Wall" :
    tileType === 0 ? "Route Path" :
    tileType === 4 ? "Flowers" :
    tileType === 5 ? "Boulder" :
    tileType === 6 ? "Tree" :
    tileType === 7 ? "Pine Tree" :
    tileType === 8 ? "Tree" :
    tileType === 9 ? "Big Bush" :
    tileType === 10 ? "Barricade" :
    tileType === 11 ? "Lamp" :
    tileType === 12 ? "Poke Center" :
    tileType === 13 ? "Mart" :
    tileType === 14 ? "Fence" :
    tileType === 15 ? "Water" :
    tileType === 16 ? "Sign" :
    tileType === 17 ? "Stairs" :
    tileType === 18 ? "Path" :
    tileType === 19 ? "Pond" :
    tileType === 20 ? "Rock" :
    tileType === 21 ? "Pebble" :
    tileType === 22 ? "Flower Bed" :
    tileType === 23 ? "Dense Grass" :
    tileType === 24 ? "Soil" :
    tileType === 25 ? "Cave" :
    tileType === 26 ? "Narrow Cave" :
    tileType === 27 ? "Giant Rock" :
    tileType === 28 ? "Light Path" :
    tileType === 29 ? "Pine" :
    tileType === 30 ? "Stump" :
    tileType === 31 ? "Reeds" :
    tileType === 32 ? "Wheat" :
    tileType === 33 ? "Mushrooms" :
    "Grass";

  const totalSavedEdits = Object.values(paintLog).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="game-container">
      <div className="layout">
        {gameState === "map" && (
          <>
            <div className="world-main">
              <div className="realm-bar">
                <span className="realm-icon">🗺</span>
                <span className="realm-title">The Legends Realm #{currentMap === "map1" ? 1 : currentMap === "map2" ? 2 : currentMap === "map5" ? 5 : 6}</span>
                <button className="realm-help" type="button">?</button>
              </div>

              <div className="map-stage">
                <Map
                  map={current}
                  camera={camera}
                  playerPos={player}
                  paintMode={paintMode}
                  onTileClick={handleTilePaint}
                />
                {transition && <div className="map-transition" />}
              </div>
            </div>

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

                {/* NEW: Git/PR Friendly Import/Export Buttons */}
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
                {fillStart && <div className="paint-hint">Fill start: ({fillStart.x}, {fillStart.y})</div>}
                <div className="paint-actions">
                  <button type="button" className="paint-action-btn" onClick={handleExportOverrides}>Export Code</button>
                  <button type="button" className="paint-action-btn" onClick={clearPaintLogForCurrentMap}>Clear Log</button>
                </div>
                {exportStatus && <div className="paint-hint" style={{ color: exportStatus.includes("✅") ? "#43a047" : exportStatus.includes("❌") ? "#d32f2f" : exportStatus.includes("📁") ? "#2196f3" : "#ffa000" }}>{exportStatus}</div>}
                <pre className="paint-output">{currentPaintLines || "// no edits yet"}</pre>
              </div>
            </aside>
          </>
        )}

        {gameState === "battle" && (
          <Battle exitBattle={() => setGameState("map")} />
        )}
      </div>
    </div>
  );
}