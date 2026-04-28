// pokemon-frontend/src/data/masterTileset.js

import { isTileWalkable } from "./tileWalkability";

export const MASTER_TILESET = {
  renderSize: 40,
  tilesets: [
    // crops: 5x5 grid = 25 tiles (IDs 0-24)
    {
      id: "crops",
      name: "Crops",
      imagePath: "/assets/tiles/crop.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 5,
      startId: 0,
      endId: 24,
      walkable: false,
      encounterRate: 0,
      description: "Crop tiles (25) — small plants and farmland"
    },

    // path: 6x6 grid = 36 tiles (IDs 25-60)
    {
      id: "path",
      name: "Path",
      imagePath: "/assets/tiles/path.png",
      tileWidth: 90,
      tileHeight: 90,
      columns: 6,
      startId: 25,
      endId: 60,
      walkable: true,
      encounterRate: 0,
      description: "Path and road tiles (6x6, 90x90)"
    },

    // houses.png: 800x416px → 25 cols × 13 rows = 325 tiles (IDs 396-720)
    {
      id: "houses",
      name: "Houses",
      imagePath: "/assets/tiles/houses.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 25,
      startId: 396,
      endId: 720,
      walkable: false,
      encounterRate: 0,
      description: "Regular buildings and structures"
    },

    // plants: 5x5 grid = 25 tiles (IDs 1081-1105)
    {
      id: "plants",
      name: "Plants",
      imagePath: "/assets/tiles/Plants.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 5,
      startId: 1081,
      endId: 1105,
      walkable: false,
      encounterRate: 0,
      description: "Plants, flowers, vegetation, and foliage"
    }
  ]
};

// Helper: Find which tileset contains a tile ID
export function findTileset(tileId) {
  return MASTER_TILESET.tilesets.find(
    ts => tileId >= ts.startId && tileId <= ts.endId
  );
}

// Helper: Get tile frame info for rendering
export function getTileFrame(tileId) {
  const tileset = findTileset(tileId);
  if (!tileset) return null;

  const localId = tileId - tileset.startId;
  const columns = tileset.columns;   // ← each tileset now has its own correct value
  const col = localId % columns;
  const row = Math.floor(localId / columns);

  return {
    tileId,
    tilesetId: tileset.id,
    imagePath: tileset.imagePath,
    col,
    row,
    x: col * tileset.tileWidth,
    y: row * tileset.tileHeight,
    width: tileset.tileWidth,
    height: tileset.tileHeight,
    walkable: isTileWalkable(tileId),
    encounterRate: tileset.encounterRate,
  };
}

// Helper: Get CSS background style for a tile
export function getTileStyle(tileId, renderSize = 40) {
  const frame = getTileFrame(tileId);
  if (!frame) return {};

  const tileset = findTileset(tileId);
  if (!tileset) return {};

  const scale = renderSize / frame.width;
  const columns = tileset.columns;
  const totalTiles = tileset.endId - tileset.startId + 1;
  const rows = Math.ceil(totalTiles / columns);
  const atlasWidth  = columns * frame.width;
  const atlasHeight = rows    * frame.height;

  return {
    backgroundImage:    `url('${frame.imagePath}')`,
    backgroundPosition: `-${frame.x * scale}px -${frame.y * scale}px`,
    backgroundSize:     `${atlasWidth * scale}px ${atlasHeight * scale}px`,
    width:              `${renderSize}px`,
    height:             `${renderSize}px`,
    imageRendering:     'pixelated',
    backgroundRepeat:   'no-repeat',
  };
}

// Check if a tile is walkable
export function isWalkable(tileId) {
  return isTileWalkable(tileId);
}

// Get encounter rate for a tile
export function getEncounterRate(tileId) {
  const tileset = findTileset(tileId);
  return tileset ? tileset.encounterRate : 0;
}

// Get tile description
export function getTileDescription(tileId) {
  const tileset = findTileset(tileId);
  return tileset ? tileset.description : "Unknown tile";
}

export default MASTER_TILESET;