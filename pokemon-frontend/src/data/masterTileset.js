// pokemon-frontend/src/data/masterTileset.js
// Generated: 26/4/2026, 10:32:59 pm

export const MASTER_TILESET = {
  renderSize: 64,
  tilesets: [
    {
      id: "fence-snow",
      name: "fence-snow",
      imagePath: "/assets/tiles/fence-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 0,
      endId: 87,
      walkable: false,  // ← Fences should block movement
      encounterRate: 0,
    },
    {
      id: "ground",
      name: "ground",
      imagePath: "/assets/tiles/ground.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 88,
      endId: 227,
      walkable: true,   // ← Ground is walkable
      encounterRate: 0.08,  // 8% encounter rate in grass
    },
    {
      id: "houses-snow",
      name: "houses-snow",
      imagePath: "/assets/tiles/houses-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 228,
      endId: 395,
      walkable: false,  // ← Houses block movement
      encounterRate: 0,
    },
    {
      id: "houses",
      name: "houses",
      imagePath: "/assets/tiles/houses.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 396,
      endId: 720,
      walkable: false,  // ← Houses block movement
      encounterRate: 0,
    },
    {
      id: "rock-snow",
      name: "rock-snow",
      imagePath: "/assets/tiles/rock-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 721,
      endId: 752,
      walkable: false,  // ← Rocks block movement
      encounterRate: 0,
    },
    {
      id: "rocks",
      name: "rocks",
      imagePath: "/assets/tiles/rocks.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 753,
      endId: 856,
      walkable: false,  // ← Rocks block movement
      encounterRate: 0,
    },
    {
      id: "trees-snow",
      name: "trees-snow",
      imagePath: "/assets/tiles/trees-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 857,
      endId: 926,
      walkable: false,  // ← Trees block movement
      encounterRate: 0,
    },
    {
      id: "trees3",
      name: "trees3",
      imagePath: "/assets/tiles/trees4.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 927,
      endId: 1070,
      walkable: false,  // ← Trees block movement
      encounterRate: 0,
    },
    {
      id: "triggers",
      name: "triggers",
      imagePath: "/assets/tiles/triggers.png",
      tileWidth: 32,
      tileHeight: 32,
      startId: 1071,
      endId: 1082,
      walkable: true,   // ← Triggers are walkable (invisible events)
      encounterRate: 0,
      isTrigger: true,
    },
  ],
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
  const col = localId % 15; // Assuming 15 columns based on your original
  const row = Math.floor(localId / 15);
  
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
    walkable: tileset.walkable,
    encounterRate: tileset.encounterRate,
  };
}

// Helper: Get CSS background style for a tile
export function getTileStyle(tileId, renderSize = 64) {
  const frame = getTileFrame(tileId);
  if (!frame) return {};
  
  const scale = renderSize / frame.width;
  const atlasWidth = 15 * frame.width;  // 15 columns
  const atlasHeight = Math.ceil(1083 / 15) * frame.height;
  
  return {
    backgroundImage: `url('${frame.imagePath}')`,
    backgroundPosition: `-${frame.x * scale}px -${frame.y * scale}px`,
    backgroundSize: `${atlasWidth * scale}px ${atlasHeight * scale}px`,
    width: `${renderSize}px`,
    height: `${renderSize}px`,
    imageRendering: 'pixelated',
  };
}

// Check if a tile is walkable
export function isWalkable(tileId) {
  const tileset = findTileset(tileId);
  return tileset ? tileset.walkable : false;
}

// Get encounter rate for a tile
export function getEncounterRate(tileId) {
  const tileset = findTileset(tileId);
  return tileset ? tileset.encounterRate : 0;
}

export default MASTER_TILESET;