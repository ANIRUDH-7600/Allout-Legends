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

function isAtSideGate(y) {
  return y >= SIDE_GATE_Y_MIN && y <= SIDE_GATE_Y_MAX;
}

function isAtVerticalGate(x) {
  return x >= VERTICAL_GATE_X_MIN && x <= VERTICAL_GATE_X_MAX;
}

export default function Game() {
  const [player, setPlayer] = useState({ x: 2, y: 2 });
  const [gameState, setGameState] = useState("map");
  const [currentMap, setCurrentMap] = useState("map1");
  const [pressedKey, setPressedKey] = useState(null);
  const [transition, setTransition] = useState(false);
  const [paintMode, setPaintMode] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState(0);
  const [fillStart, setFillStart] = useState(null);
  const [exportStatus, setExportStatus] = useState("");
  const [paintLog, setPaintLog] = useState({
    map1: [],
    map2: [],
    map5: [],
    map6: [],
  });
  const current = maps[currentMap];

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

        return {
          ...prev,
          [currentMap]: list,
        };
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
  }, [handleMove, paintMode]);

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

                <div className="paint-hint">Press P to toggle, [ / ] to change ID, click map to paint.</div>
                <div className="paint-hint">Shift+click = rectangle fill. Right-click = erase to id 0.</div>
                {fillStart && <div className="paint-hint">Fill start: ({fillStart.x}, {fillStart.y})</div>}
                <div className="paint-actions">
                  <button type="button" className="paint-action-btn" onClick={handleExportOverrides}>Export</button>
                  <button type="button" className="paint-action-btn" onClick={clearPaintLogForCurrentMap}>Clear Log</button>
                </div>
                {exportStatus && <div className="paint-hint">{exportStatus}</div>}
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