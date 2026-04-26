export const TILE_RENDER_SIZE = 64;

export const TILESET_META = {
  imagePath: "/assets/tileset.png",   // ← was tileset_index.png
  atlasWidth: 1535,
  atlasHeight: 710,
  tileWidth: 102,                      // ← was 180
  tileHeight: 101,                     // ← was 180
  strideX: 102,
  strideY: 101,
  offsetX: 0,
  offsetY: 0,
};

export const TILESET_COLS = 15;       // ← was 16
export const TILESET_ROWS = 7;
export const TILESET_MAX_ID = 104;   // 15*7 - 1

export function clampTileId(rawId) {
  const value = Number.isFinite(rawId) ? rawId : 0;
  return Math.max(0, Math.min(TILESET_MAX_ID, value));
}

export function getTileFrameById(tileId) {
  const safeId = clampTileId(tileId);
  const col = safeId % TILESET_COLS;
  const row = Math.floor(safeId / TILESET_COLS);

  return {
    id: safeId,
    col,
    row,
    x: TILESET_META.offsetX + (col * TILESET_META.strideX),
    y: TILESET_META.offsetY + (row * TILESET_META.strideY),
    width: TILESET_META.tileWidth,
    height: TILESET_META.tileHeight,
  };
}