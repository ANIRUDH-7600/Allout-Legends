// pokemon-frontend/src/data/tilesetMeta.js
// This file is a compatibility wrapper for masterTileset.js

import { 
  getTileFrame, 
  getTileStyle, 
  isWalkable, 
  getEncounterRate,
  MASTER_TILESET 
} from "./masterTileset";

// Re-export for backward compatibility
export const TILE_RENDER_SIZE = 64;
export const TILESET_META = {
  imagePath: "/assets/tiles/ground.png",
  atlasWidth: 512,
  atlasHeight: 512,
  tileWidth: 32,
  tileHeight: 32,
  strideX: 32,
  strideY: 32,
  offsetX: 0,
  offsetY: 0,
};
export const TILESET_COLS = 16;
export const TILESET_ROWS = 16;
export const TILESET_MAX_ID = 1791; // Update to cover all tiles (0-1082)

export function clampTileId(rawId) {
  return Math.max(0, Math.min(1082, rawId));
}

export { 
  getTileFrame as getTileFrameById, 
  getTileStyle, 
  isWalkable, 
  getEncounterRate,
  MASTER_TILESET
};