// pokemon-frontend/src/data/tilesetMeta.js
// This file is now deprecated. Use masterTileset.js instead.
// Kept for backward compatibility.

import { getTileFrame, getTileStyle, isWalkable, getEncounterRate } from "./masterTileset";

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
export const TILESET_MAX_ID = 255;

export function clampTileId(rawId) {
  return Math.max(0, Math.min(1791, rawId));
}

export { getTileFrame as getTileFrameById, getTileStyle, isWalkable, getEncounterRate };