// pokemon-frontend/src/data/masterTileset.js

export const MASTER_TILESET = {
  renderSize: 64,
  tilesets: [
    // fence-snow.png: 256x352px → 8 cols × 11 rows = 88 tiles (IDs 0-87)
    {
      id: "fence-snow",
      name: "Fence Snow",
      imagePath: "/assets/tiles/fence-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 8,
      startId: 0,
      endId: 87,
      walkable: false,
      encounterRate: 0,
      description: "Snow fences and borders"
    },

    // ground.png: 640x224px → 20 cols × 7 rows = 140 tiles (IDs 88-227)
    {
      id: "ground",
      name: "Ground Terrain",
      imagePath: "/assets/tiles/ground.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 20,
      startId: 88,
      endId: 227,
      walkable: true,
      encounterRate: 0.08,
      description: "Grass, dirt, sand, and natural ground"
    },

    // houses-snow.png: 672x256px → 21 cols × 8 rows = 168 tiles (IDs 228-395)
    {
      id: "houses-snow",
      name: "Snow Houses",
      imagePath: "/assets/tiles/houses-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 21,
      startId: 228,
      endId: 395,
      walkable: false,
      encounterRate: 0,
      description: "Snow-covered buildings and structures"
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

    // rock-snow: assume 8 cols (similar to rocks), 32 tiles (IDs 721-752)
    {
      id: "rock-snow",
      name: "Snow Rocks",
      imagePath: "/assets/tiles/rock-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 8,
      startId: 721,
      endId: 752,
      walkable: false,
      encounterRate: 0,
      description: "Snow-covered rocks and boulders"
    },

    // rocks.png: 256x416px → 8 cols × 13 rows = 104 tiles (IDs 753-856)
    {
      id: "rocks",
      name: "Rocks",
      imagePath: "/assets/tiles/rocks.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 8,
      startId: 753,
      endId: 856,
      walkable: false,
      encounterRate: 0,
      description: "Rocks, boulders, and stone features"
    },

    // trees-snow: 70 tiles — assume 10 cols (IDs 857-926)
    {
      id: "trees-snow",
      name: "Snow Trees",
      imagePath: "/assets/tiles/trees-snow.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 10,
      startId: 857,
      endId: 926,
      walkable: false,
      encounterRate: 0,
      description: "Snow-covered trees"
    },

    // trees4.png: 144 tiles — assume 12 cols (IDs 927-1070)
    {
      id: "trees",
      name: "Trees",
      imagePath: "/assets/tiles/trees4.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 12,
      startId: 927,
      endId: 1070,
      walkable: false,
      encounterRate: 0,
      description: "Regular trees and foliage"
    },

    // triggers: 6 tiles (IDs 1071-1080)
    {
      id: "triggers",
      name: "Triggers",
      imagePath: "/assets/tiles/triggers.png",
      tileWidth: 32,
      tileHeight: 32,
      columns: 6,
      startId: 1071,
      endId: 1080,
      walkable: true,
      encounterRate: 0,
      isTrigger: true,
      description: "Event triggers (invisible)"
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
    walkable: tileset.walkable,
    encounterRate: tileset.encounterRate,
  };
}

// Helper: Get CSS background style for a tile
export function getTileStyle(tileId, renderSize = 64) {
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
  const tileset = findTileset(tileId);
  return tileset ? tileset.walkable : false;
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