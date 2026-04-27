const fs = require('fs');
const path = require('path');

const tileIdsPath = path.join(__dirname, '../src/data/tileIds.js');
const content = fs.readFileSync(tileIdsPath, 'utf8');

// Find insertion point for PLANT_* IDs
const tileIdsExportStart = content.indexOf('export const TILE_IDS = {');
const tileInfoStart = content.indexOf('export const TILE_INFO = {');
const insertPointIds = tileInfoStart;

// Generate plant tile IDs (1081-2601)
let plantIds = '';
for (let i = 1081; i <= 2601; i++) {
  const plantIndex = i - 1081;
  plantIds += `  PLANT_${plantIndex}: ${i},\n`;
}

// Generate TILE_INFO entries
let plantInfo = '';
for (let i = 1081; i <= 2601; i++) {
  const plantIndex = i - 1081;
  plantInfo += `  ${i}: { name: "plant_${plantIndex}", image: "Plants.png" },\n`;
}

// Insert plant IDs before TILE_INFO
const beforeTileInfo = content.substring(0, insertPointIds);
const afterTileInfoStart = content.substring(insertPointIds);

// Insert before TILE_INFO export
const withPlantIds = beforeTileInfo + plantIds + '\n' + afterTileInfoStart;

// Now find TILE_INFO closing brace and insert plant info
const closingBraceIndex = withPlantIds.lastIndexOf('};');
const beforeClosing = withPlantIds.substring(0, closingBraceIndex);
const finalContent = beforeClosing + plantInfo + '};';

fs.writeFileSync(tileIdsPath, finalContent, 'utf8');
console.log('✓ Added 1521 plant tile IDs to tileIds.js (1081-2601)');
