const fs = require('fs');
const path = require('path');

const tileIdsPath = path.join(__dirname, '../src/data/tileIds.js');
const masterTilesetPath = path.join(__dirname, '../src/data/masterTileset.js');
const tilesetMetaPath = path.join(__dirname, '../src/data/tilesetMeta.js');

// === UPDATE tileIds.js ===
let tileIdsContent = fs.readFileSync(tileIdsPath, 'utf8');

// Find and update TILE_IDS object
const tileIdsMatch = tileIdsContent.match(/export const TILE_IDS = \{([\s\S]*?)\n\};/);
if (tileIdsMatch) {
  let tileIdsObject = tileIdsMatch[1];
  let plantIds = '';
  for (let i = 1081; i <= 1105; i++) {
    const plantIndex = i - 1081;
    plantIds += `  PLANT_${plantIndex}: ${i},\n`;
  }
  
  const updatedTileIds = tileIdsObject.trimEnd().replace(/,\s*$/, '') + ',\n' + plantIds;
  tileIdsContent = tileIdsContent.replace(
    /export const TILE_IDS = \{[\s\S]*?\n\};/,
    `export const TILE_IDS = {${updatedTileIds}\n};`
  );
}

// Find and update TILE_INFO object
const tileInfoMatch = tileIdsContent.match(/export const TILE_INFO = \{([\s\S]*?)\n\};/);
if (tileInfoMatch) {
  let tileInfoObject = tileInfoMatch[1];
  let plantInfo = '';
  for (let i = 1081; i <= 1105; i++) {
    const plantIndex = i - 1081;
    plantInfo += `  ${i}: { name: "plant_${plantIndex}", image: "Plants.png" },\n`;
  }
  
  const updatedTileInfo = tileInfoObject.trimEnd().replace(/,\s*$/, '') + ',\n' + plantInfo;
  tileIdsContent = tileIdsContent.replace(
    /export const TILE_INFO = \{[\s\S]*?\n\};/,
    `export const TILE_INFO = {${updatedTileInfo}\n};`
  );
}

fs.writeFileSync(tileIdsPath, tileIdsContent, 'utf8');

// === UPDATE masterTileset.js ===
let masterTilesetContent = fs.readFileSync(masterTilesetPath, 'utf8');

// Find the end of tilesets array and insert plants before the closing bracket
masterTilesetContent = masterTilesetContent.replace(
  /    \}\s*\]\s*\};/,
  `    },
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
};`
);

fs.writeFileSync(masterTilesetPath, masterTilesetContent, 'utf8');

// === UPDATE tilesetMeta.js ===
let tilesetMetaContent = fs.readFileSync(tilesetMetaPath, 'utf8');
tilesetMetaContent = tilesetMetaContent.replace(
  /export const TILESET_MAX_ID = \d+/,
  'export const TILESET_MAX_ID = 1105'
);
fs.writeFileSync(tilesetMetaPath, tilesetMetaContent, 'utf8');

console.log('✓ Successfully integrated Plants tileset (5×5 grid)');
console.log('  - Added 25 plant tile IDs (PLANT_0 to PLANT_24)');
console.log('  - Plants tile IDs: 1081-1105');
console.log('  - Grid: 5 columns × 5 rows (32×32px each)');
