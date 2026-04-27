// pokemon-frontend/src/components/Game.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import Map from "./Map";
import Battle from "./Battle";
import MapEditor from "./MapEditor";
import Sidebar from "./Sidebar";
import { maps } from "../data/maps";
import { clampTileId, TILESET_MAX_ID } from "../data/tilesetMeta";
import { movePlayer } from "../logic/movement";
import { checkEncounter } from "../logic/encounter";

const TILE = 40;
const VIEWPORT_W = 900;
// Height is dynamic (100vh - 68px), use a generous default for camera calc
const VIEWPORT_H = typeof window !== 'undefined' ? window.innerHeight - 68 : 700;
const SIDE_GATE_Y_MIN = 14;
const SIDE_GATE_Y_MAX = 15;
const VERTICAL_GATE_X_MIN = 14;
const VERTICAL_GATE_X_MAX = 15;

// localStorage keys
const STORAGE_KEYS = {
  PAINT_LOG: "allout_legends_paint_log",
  CURRENT_MAP: "allout_legends_current_map",
  PLAYER_POS: "allout_legends_player_pos",
  TILE_SCALES: "allout_legends_tile_scales",
};

// Default tile scales baked in from allout_map_2026-04-27T18-53-50.json
// These are used as a fallback when localStorage has no saved scales.
const DEFAULT_TILE_SCALES = {
  map1: {
    "5,3": 1.25, "6,3": 1.25, "4,2": 1.1, "5,2": 1.1, "6,2": 1.1,
    "4,1": 1.1, "5,1": 1.1, "6,1": 1.1, "5,0": 1.1, "4,0": 1.1,
    "6,0": 1.1, "7,3": 1.25, "8,3": 1.25, "7,2": 1.1, "8,2": 1.1,
    "8,1": 1.1, "7,1": 1.1, "7,0": 1.1, "8,0": 1.1, "9,0": 1.1,
    "9,1": 1.1, "9,2": 1.1, "9,3": 1.25, "10,3": 1.25, "10,2": 1.1,
    "10,1": 1.1, "10,0": 1.1, "4,6": 1.25, "4,7": 1.25, "4,8": 1.25,
    "4,9": 1.25, "4,10": 1.25, "4,11": 1.25, "3,11": 1.25, "2,11": 1.25,
    "1,11": 1.25, "0,11": 1.25, "0,10": 1.25, "1,10": 1.25, "2,10": 1.25,
    "3,10": 1.25, "3,9": 1.25, "2,9": 1.25, "1,9": 1.25, "0,9": 1.25,
    "0,8": 1.25, "1,8": 1.25, "2,8": 1.25, "3,8": 1.25, "3,7": 1.25,
    "2,7": 1.25, "1,7": 1.25, "0,7": 1.25, "0,6": 1.25, "2,6": 1.25,
    "3,6": 1.25, "15,6": 1.25, "15,7": 1.15, "16,7": 1.15, "16,6": 1.25,
    "17,6": 1.25, "17,7": 1.15, "18,7": 1.15, "18,6": 1.25, "19,6": 1.25,
    "19,7": 1.15, "20,7": 1.2, "20,6": 1.25, "21,6": 1.25, "21,7": 1.2,
    "22,6": 1.25, "22,7": 1.2, "7,8": 1.25, "15,8": 1.15, "16,8": 1.15,
    "17,8": 1.15, "20,8": 1.2, "21,8": 1.2, "22,8": 1.2, "10,10": 1.2,
    "10,11": 1.2, "15,9": 1.15, "18,9": 1.15, "17,9": 1.15, "17,10": 1.2,
    "17,11": 1.2, "17,12": 1.2, "17,13": 1.25, "7,16": 1.25, "7,17": 1.25,
    "7,18": 1.25, "8,16": 1.25, "9,16": 1.25, "10,16": 1.25, "11,16": 1.25,
    "12,16": 1.25, "13,16": 1.25, "16,17": 1.35, "16,18": 1.35, "17,18": 1.35,
    "17,17": 1.35, "19,16": 1.25, "20,16": 1.25, "21,16": 1.25, "22,16": 1.25,
    "22,17": 1.35, "22,18": 1.35, "21,18": 1.35, "21,17": 1.35, "20,17": 1.35,
    "20,18": 1.35, "19,18": 1.35, "18,18": 1.35, "18,17": 1.35, "19,17": 1.35,
    "7,6": 1.25, "7,7": 1.25, "8,6": 1.25, "9,6": 1.25, "10,6": 1.25,
    "11,6": 1.25, "12,6": 1.25, "13,6": 1.25, "14,6": 1.25, "4,3": 1.25,
    "14,7": 1.15, "7,9": 1.25, "7,10": 1.25, "7,11": 1.25, "7,12": 1.25,
    "7,13": 1.25, "16,3": 1.25, "17,3": 1.25, "18,3": 1.25, "19,3": 1.25,
    "20,3": 1.25, "21,3": 1.25, "22,3": 1.25, "16,0": 1.1, "17,0": 1.1,
    "18,0": 1.1, "19,0": 1.1, "20,0": 1.1, "21,0": 1.1, "22,0": 1.1,
    "13,17": 1.05, "13,18": 1.05, "12,17": 1.05, "12,18": 1.05, "11,17": 1.05,
    "10,17": 1.05, "9,17": 1.05, "8,17": 1.05, "8,18": 1.05, "9,18": 1.05,
    "10,18": 1.05, "11,18": 1.05, "14,9": 1.15, "13,9": 1.15, "12,9": 1.15,
    "10,9": 1.15, "11,9": 1.15, "8,9": 1.15, "8,7": 1.15, "9,7": 1.15,
    "9,8": 1.15, "8,8": 1.15, "9,9": 1.15, "10,7": 1.15, "10,8": 1.15,
    "11,8": 1.15, "11,7": 1.15, "12,7": 1.15, "12,8": 1.15, "9,10": 1.2,
    "8,10": 1.2, "8,11": 1.2, "9,11": 1.2, "13,8": 1.15, "13,7": 1.15,
    "14,8": 1.15, "16,9": 1.15, "18,8": 1.15, "19,9": 1.15, "19,8": 1.15,
    "8,13": 1.25, "9,13": 1.25, "18,13": 1.25, "19,13": 1.25, "16,13": 1.25,
    "16,12": 1.2, "16,11": 1.2, "16,10": 1.2, "18,12": 1.2, "19,12": 1.2,
    "18,11": 1.2, "18,10": 1.2, "19,10": 1.2, "19,11": 1.2, "8,12": 1.2,
    "9,12": 1.2, "15,4": 1.3, "15,5": 1.3, "14,4": 1.3, "14,5": 1.3,
    "16,5": 1.3, "16,4": 1.3, "17,4": 1.3, "17,5": 1.3, "19,5": 1.3,
    "18,4": 1.3, "18,5": 1.3, "19,4": 1.3, "20,4": 1.3, "20,5": 1.3,
    "21,5": 1.3, "21,4": 1.3, "22,4": 1.3, "22,5": 1.3, "13,4": 1.3,
    "13,5": 1.3, "12,4": 1.3, "12,5": 1.3, "11,4": 1.3, "11,5": 1.3,
    "10,4": 1.3, "10,5": 1.3, "9,4": 1.3, "8,4": 1.3, "7,4": 1.3,
    "6,4": 1.3, "4,4": 1.3, "3,4": 1.3, "2,4": 1.3, "1,4": 1.3,
    "0,4": 1.3, "0,5": 1.3, "1,5": 1.3, "2,5": 1.3, "3,5": 1.3,
    "4,5": 1.3, "5,4": 1.3, "5,5": 1.3, "6,5": 1.3, "7,5": 1.3,
    "8,5": 1.3, "9,5": 1.3, "16,16": 1.25, "17,16": 1.25, "18,16": 1.25,
    "16,2": 1.1, "17,2": 1.1, "16,1": 1.1, "17,1": 1.1, "22,1": 1.1,
    "22,2": 1.1, "21,2": 1.1, "21,1": 1.1, "20,1": 1.1, "19,1": 1.1,
    "18,1": 1.1, "18,2": 1.1, "19,2": 1.1, "20,2": 1.1, "1,6": 1.25,
    "4,12": 1.25, "4,13": 1.25, "4,16": 1.25, "4,17": 1.25, "4,18": 1.25,
    "0,12": 1.25, "1,12": 1.25, "2,12": 1.25, "3,12": 1.25, "3,13": 1.25,
    "2,13": 1.25, "1,13": 1.25, "0,13": 1.25, "0,14": 1.25, "0,15": 1.25,
    "0,16": 1.25, "0,17": 1.25, "0,18": 1.25, "1,18": 1.25, "2,18": 1.25,
    "3,18": 1.25, "3,17": 1.25, "3,16": 1.25, "3,15": 1.25, "3,14": 1.25,
    "2,14": 1.25, "1,14": 1.25, "1,15": 1.25, "2,15": 1.25, "2,16": 1.25,
    "1,16": 1.25, "1,17": 1.25, "2,17": 1.25, "5,14": 1.5, "6,14": 1.5,
    "6,15": 1.5, "5,15": 1.5, "4,14": 1.5, "4,15": 1.5, "20,13": 1.25,
    "21,13": 1.25, "22,13": 1.25, "20,9": 1.2, "20,10": 1.2, "20,11": 1.2,
    "20,12": 1.2, "21,12": 1.2, "22,12": 1.2, "21,11": 1.2, "22,11": 1.2,
    "21,10": 1.2, "21,9": 1.2, "22,9": 1.2, "22,10": 1.2,
  },
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
        console.error("Failed to parse player position:", e);
        return { x: 5, y: 5 };
      }
    }
    return { x: 5, y: 5 };
  };

  const getInitialCurrentMap = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_MAP);
    return saved && (saved === "map1" || saved === "map2" || saved === "map5" || saved === "map6") 
      ? saved 
      : "map1";
  };

  // ============ STATE ============
  const [player, setPlayer] = useState(getInitialPlayerPos);
  const [gameState, setGameState] = useState("map");
  const [currentMap, setCurrentMap] = useState(getInitialCurrentMap);
  const [pressedKey, setPressedKey] = useState(null);
  const [transition, setTransition] = useState(false);
  const [paintMode, setPaintMode] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState(0);
  const [fillStart, setFillStart] = useState(null);
  const [exportStatus, setExportStatus] = useState("");
  const [encounterArea, setEncounterArea] = useState("grass");
  
  // Sidebar state
  const [activeSection, setActiveSection] = useState("profile");
  const [party] = useState([
    { id: "PIKACHU", name: "Pikachu", level: 10, hp: 50, maxHp: 50 }
  ]);
  
  // Load saved paint log on startup
  const [paintLog, setPaintLog] = useState(() => {
    const savedLog = loadSavedPaintLog();
    applySavedOverridesToMaps(savedLog);
    return savedLog;
  });
  
  // tileScales: { [mapName]: { "x,y": scale } } — per map, per position
  // Merges baked-in defaults with any saved overrides from localStorage.
  const [tileScales, setTileScalesState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TILE_SCALES);
      const fromStorage = saved ? JSON.parse(saved) : {};
      // Deep merge: storage values win over defaults (so editor changes persist)
      const merged = { ...DEFAULT_TILE_SCALES };
      Object.keys(fromStorage).forEach(mapName => {
        merged[mapName] = { ...(DEFAULT_TILE_SCALES[mapName] || {}), ...fromStorage[mapName] };
      });
      return merged;
    } catch {
      return { ...DEFAULT_TILE_SCALES };
    }
  });

  const [pendingScale, setPendingScale] = useState(1);
  const [hoveredTile, setHoveredTile] = useState(null);

  const setPositionScale = useCallback((mapName, x, y, scale) => {
    setTileScalesState((prev) => {
      const mapScales = { ...(prev[mapName] || {}) };
      const key = `${x},${y}`;
      // Preserve scales that differ from default (1).
      // Previously scales >= 1 were removed which prevented storing increases >100%.
      if (scale === 1) {
        delete mapScales[key];
      } else {
        mapScales[key] = scale;
      }
      const next = { ...prev, [mapName]: mapScales };
      localStorage.setItem(STORAGE_KEYS.TILE_SCALES, JSON.stringify(next));
      return next;
    });
  }, []);

  const current = maps[currentMap];
  const mapNames = { map1: "Realm 1", map2: "Realm 2", map5: "Realm 5", map6: "Realm 6" };

  // Sidebar handler
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Add section-specific logic here later
    console.log(`Switched to: ${section}`);
  };

  // ============ EFFECTS ============
  // Save player position whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_POS, JSON.stringify(player));
  }, [player]);

  // Save current map whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MAP, currentMap);
  }, [currentMap]);

  // ============ CAMERA ============
  const camera = useMemo(() => {
    const mapW = current[0].length * TILE;
    const mapH = current.length * TILE;
    const cx = Math.max(0, Math.min(player.x * TILE - VIEWPORT_W / 2, mapW - VIEWPORT_W));
    const cy = Math.max(0, Math.min(player.y * TILE - VIEWPORT_H / 2, mapH - VIEWPORT_H));
    return { x: cx, y: cy };
  }, [player, current]);

  // ============ MOVEMENT ============
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

    // Normal movement with encounter check
    const newPos = movePlayer(player, key, current);
    if (newPos.x !== player.x || newPos.y !== player.y) {
      setPlayer(newPos);
      const encounter = checkEncounter(newPos.x, newPos.y, current);
      if (encounter.shouldBattle) {
        setEncounterArea(encounter.area);
        setGameState("battle");
      }
    }
  }, [player, gameState, currentMap, current, paintMode]);

  // ============ PAINT HANDLERS ============
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

        return { ...prev, [currentMap]: list };
      });
    };

    if (options.action === "erase") {
      const eraseId = 0;
      maps[currentMap][y][x] = eraseId;
      upsertEntries([{ x, y, id: eraseId }]);
      setPositionScale(currentMap, x, y, 1);
      setFillStart(null);
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
            setPositionScale(currentMap, xx, yy, pendingScale);
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
    setPositionScale(currentMap, x, y, pendingScale);
    setFillStart(null);
  }, [paintMode, current, selectedTileId, currentMap, fillStart, pendingScale, setPositionScale]);

  // ============ STORAGE HANDLERS ============
  const handleSaveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAINT_LOG, JSON.stringify(paintLog));
      localStorage.setItem(STORAGE_KEYS.CURRENT_MAP, currentMap);
      localStorage.setItem(STORAGE_KEYS.PLAYER_POS, JSON.stringify(player));
      localStorage.setItem(STORAGE_KEYS.TILE_SCALES, JSON.stringify(tileScales));
      
      const totalEdits = Object.values(paintLog).reduce((sum, arr) => sum + arr.length, 0);
      setExportStatus(`✅ Saved ${totalEdits} tile edits to browser storage!`);
      
      const timeoutId = setTimeout(() => {
        setExportStatus(prev => prev.includes("✅") ? "" : prev);
      }, 3000);
      return () => clearTimeout(timeoutId);
    } catch (err) {
      console.error("Save failed:", err);
      setExportStatus("❌ Save failed!");
    }
  }, [paintLog, currentMap, player, tileScales]);

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
      const totalEdits = Object.values(savedLog).reduce((sum, arr) => sum + arr.length, 0);
      setExportStatus(`📂 Loaded ${totalEdits} saved edits!`);
      
      const timeoutId = setTimeout(() => {
        setExportStatus(prev => prev.includes("📂") ? "" : prev);
      }, 3000);
      return () => clearTimeout(timeoutId);
    } catch (err) {
      console.error("Load failed:", err);
      setExportStatus("❌ Load failed!");
    }
  }, []);

  const handleResetAllData = useCallback(() => {
    if (window.confirm("⚠️ WARNING: This will delete ALL saved map edits and reset player position! This cannot be undone. Continue?")) {
      localStorage.removeItem(STORAGE_KEYS.PAINT_LOG);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_MAP);
      localStorage.removeItem(STORAGE_KEYS.PLAYER_POS);
      setPaintLog({ map1: [], map2: [], map5: [], map6: [] });
      setCurrentMap("map1");
      setPlayer({ x: 5, y: 5 });
      window.location.reload();
    }
  }, []);

  // ============ FILE HANDLERS ============
  const handleExportToFile = useCallback(() => {
    const totalEdits = Object.values(paintLog).reduce((sum, arr) => sum + arr.length, 0);
    if (totalEdits === 0) {
      setExportStatus("No edits to export.");
      return;
    }
    
    const exportData = {
      version: "1.1",
      createdAt: new Date().toISOString(),
      edits: paintLog,
      tileScales: tileScales,
      metadata: { currentMap, playerPos: player, totalEdits }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `allout_map_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportStatus(`📁 Exported ${totalEdits} tile edits!`);
    const timeoutId = setTimeout(() => {
      setExportStatus(prev => prev.includes("📁") ? "" : prev);
    }, 4000);
    return () => clearTimeout(timeoutId);
  }, [paintLog, currentMap, player]);

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
          let importedEdits;
          let importedScales = null;
          
          if (imported.version && imported.edits) {
            importedEdits = imported.edits;
            importedScales = imported.tileScales || null;
          } else if (imported.map1 || imported.map2 || imported.map5 || imported.map6) {
            importedEdits = imported;
          } else {
            setExportStatus("❌ Invalid map file format");
            return;
          }
          
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
          localStorage.setItem(STORAGE_KEYS.PAINT_LOG, JSON.stringify(importedEdits));

          if (importedScales) {
            setTileScalesState(importedScales);
            localStorage.setItem(STORAGE_KEYS.TILE_SCALES, JSON.stringify(importedScales));
          }
          
          const totalEdits = Object.values(importedEdits).reduce((sum, arr) => sum + arr.length, 0);
          setExportStatus(`✅ Imported ${totalEdits} tile edits!`);
          
          setTimeout(() => {
            setExportStatus(prev => prev.includes("✅") ? "" : prev);
          }, 4000);
        } catch (err) {
          console.error("Import failed:", err);
          setExportStatus("❌ Failed to import file.");
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

    const mapScales = tileScales[currentMap] || {};
    const block = `${currentMap}: [\n${entries.map((entry) => {
      const scale = mapScales[`${entry.x},${entry.y}`];
      const scalePart = scale && scale !== 1 ? `, scale: ${scale}` : "";
      return `  [${entry.x}, ${entry.y}, ${entry.id}${scalePart ? ` /*${scalePart} */` : ""}],`;
    }).join("\n")}\n],`;

    try {
      await navigator.clipboard.writeText(block);
      setExportStatus("Copied override block to clipboard.");
    } catch (err) {
      console.error("Clipboard failed:", err);
      console.log(block);
      setExportStatus("Clipboard blocked. Block printed to console.");
    }
  }, [paintLog, currentMap, tileScales]);

  const clearPaintLogForCurrentMap = useCallback(() => {
    setPaintLog((prev) => ({ ...prev, [currentMap]: [] }));
    setExportStatus("Cleared paint log for this realm.");
    setFillStart(null);
  }, [currentMap]);

  // ============ KEYBOARD ============
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

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
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
  }, [handleMove, paintMode, handleSaveToLocalStorage, setSelectedTileId]);

  // ============ DPAD ============
  const handleDpad = (dir) => {
    const keyMap = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };
    setPressedKey(keyMap[dir]);
    handleMove(keyMap[dir]);
    setTimeout(() => setPressedKey(null), 150);
  };

  // ============ UTILITIES ============
  const currentPaintLines = (paintLog[currentMap] || [])
    .slice()
    .sort((a, b) => (a.y - b.y) || (a.x - b.x))
    .map((entry) => `[${entry.x}, ${entry.y}, ${entry.id}],`)
    .join("\n");

  const tileType = current[player.y]?.[player.x];
  const terrainName = getTerrainName(tileType);
  const totalSavedEdits = Object.values(paintLog).reduce((sum, arr) => sum + arr.length, 0);

  function getTerrainName(tileTypeNum) {
    const terrainMap = {
      2: "Tall Grass", 1: "Rock Wall", 0: "Route Path", 4: "Flowers",
      5: "Boulder", 6: "Tree", 7: "Pine Tree", 8: "Tree", 9: "Big Bush",
      10: "Barricade", 11: "Lamp", 12: "Poke Center", 13: "Mart",
      14: "Fence", 15: "Water", 16: "Sign", 17: "Stairs", 18: "Path",
      19: "Pond", 20: "Rock", 21: "Pebble", 22: "Flower Bed", 23: "Dense Grass",
      24: "Soil", 25: "Cave", 26: "Narrow Cave", 27: "Giant Rock", 28: "Light Path",
      29: "Pine", 30: "Stump", 31: "Reeds", 32: "Wheat", 33: "Mushrooms"
    };
    return terrainMap[tileTypeNum] || "Grass";
  }

  // ============ RENDER ============
  return (
    <div className="game-container">
      <Sidebar 
        player={{ x: player.x, y: player.y, mapId: currentMap }}
        party={party}
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
      />
      <div className="layout">
        {gameState === "map" && (
          <>
            <div className="world-main">
              <div className="realm-bar">
                <span className="realm-icon">🗺</span>
                <span className="realm-title">
                  The Legends Realm #{currentMap === "map1" ? 1 : currentMap === "map2" ? 2 : currentMap === "map5" ? 5 : 6}
                </span>
                <button className="realm-help" type="button">?</button>
              </div>

              <div className="map-stage">
                <Map
                  map={current}
                  camera={camera}
                  playerPos={player}
                  paintMode={paintMode}
                  onTileClick={handleTilePaint}
                  tileScales={tileScales[currentMap] || {}}
                  onTileHover={paintMode ? setHoveredTile : null}
                />
                {transition && <div className="map-transition" />}
              </div>
            </div>

            <MapEditor
              paintMode={paintMode}
              setPaintMode={setPaintMode}
              selectedTileId={selectedTileId}
              setSelectedTileId={setSelectedTileId}
              handleSaveToLocalStorage={handleSaveToLocalStorage}
              handleLoadFromLocalStorage={handleLoadFromLocalStorage}
              handleResetAllData={handleResetAllData}
              handleExportToFile={handleExportToFile}
              handleImportFromFile={handleImportFromFile}
              handleExportOverrides={handleExportOverrides}
              clearPaintLogForCurrentMap={clearPaintLogForCurrentMap}
              exportStatus={exportStatus}
              fillStart={fillStart}
              currentPaintLines={currentPaintLines}
              currentMap={currentMap}
              mapNames={mapNames}
              player={player}
              terrainName={terrainName}
              totalSavedEdits={totalSavedEdits}
              pressedKey={pressedKey}
              handleDpad={handleDpad}
              pendingScale={pendingScale}
              setPendingScale={setPendingScale}
              tileScales={tileScales[currentMap] || {}}
              hoveredTile={hoveredTile}
            />
          </>
        )}

        {gameState === "battle" && (
          <Battle exitBattle={() => setGameState("map")} area={encounterArea} />
        )}
      </div>
    </div>
  );
}