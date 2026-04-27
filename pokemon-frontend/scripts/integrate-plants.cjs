const fs = require('fs');
const path = require('path');

const tileIdsPath = path.join(__dirname, '../src/data/tileIds.js');

// Read the original clean file
let content = fs.readFileSync(tileIdsPath, 'utf8');

// Find where TILE_IDS object ends (the closing brace)
const tileIdsMatch = content.match(/export const TILE_IDS = \{([\s\S]*?)\n\};/);
if (!tileIdsMatch) {
  console.error('Could not find TILE_IDS object');
  process.exit(1);
}

// Get the content of TILE_IDS
let tileIdsContent = tileIdsMatch[1];

// Generate plant IDs (1521 tiles: 1081-2601)
let plantIds = '';
for (let i = 1081; i <= 2601; i++) {
  const plantIndex = i - 1081;
  plantIds += `  PLANT_${plantIndex}: ${i},\n`;
}

// Add plant IDs to the TILE_IDS object (before closing brace)
const updatedTileIds = tileIdsContent.trimEnd().replace(/,\s*$/, '') + ',\n' + plantIds;
content = content.replace(/export const TILE_IDS = \{[\s\S]*?\n\};/, `export const TILE_IDS = {${updatedTileIds}\n};`);

// Now update TILE_INFO - find it and add plants
const tileInfoMatch = content.match(/export const TILE_INFO = \{([\s\S]*?)\n\};/);
if (!tileInfoMatch) {
  console.error('Could not find TILE_INFO object');
  process.exit(1);
}

let tileInfoContent = tileInfoMatch[1];

// Generate plant info entries
let plantInfo = '';
for (let i = 1081; i <= 2601; i++) {
  const plantIndex = i - 1081;
  plantInfo += `  ${i}: { name: "plant_${plantIndex}", image: "Plants.png" },\n`;
}

// Add plant info to TILE_INFO (before closing brace)
const updatedTileInfo = tileInfoContent.trimEnd().replace(/,\s*$/, '') + ',\n' + plantInfo;
content = content.replace(/export const TILE_INFO = \{[\s\S]*?\n\};/, `export const TILE_INFO = {${updatedTileInfo}\n};`);

fs.writeFileSync(tileIdsPath, content, 'utf8');
console.log('✓ Successfully integrated Plants tileset');
console.log('  - Added 1521 plant tile IDs (PLANT_0 to PLANT_1520)');
console.log('  - Plants tile IDs: 1081-2601');
console.log('  - Added TILE_INFO entries for all plants');
