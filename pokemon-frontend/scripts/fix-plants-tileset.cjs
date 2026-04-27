const fs = require('fs');
const path = require('path');

const tileIdsPath = path.join(__dirname, '../src/data/tileIds.js');
let content = fs.readFileSync(tileIdsPath, 'utf8');

// Remove the incorrectly placed plant IDs (they're outside the object)
const regex = /\n\n  PLANT_\d+: \d+,[\s\S]*?export const TILE_INFO/;
content = content.replace(regex, '\nexport const TILE_INFO');

// Find the closing brace of TILE_IDS object
const tileIdsStart = content.indexOf('export const TILE_IDS');
const tileIdsClosing = content.indexOf('};', tileIdsStart);

// Generate plant tile IDs (1521 tiles: 1081-2601)
let plantIds = '';
for (let i = 1081; i <= 2601; i++) {
  const plantIndex = i - 1081;
  plantIds += `  PLANT_${plantIndex}: ${i},\n`;
}

// Get the part before the closing brace (remove the last comma if present)
let before = content.substring(0, tileIdsClosing - 1);
if (before.endsWith(',\n')) {
  before = before.slice(0, -2); // Remove last comma and newline
}
before += ',\n' + plantIds;

const after = content.substring(tileIdsClosing - 1);
const fixed = before + after;

fs.writeFileSync(tileIdsPath, fixed, 'utf8');
console.log('✓ Fixed tileIds.js - plant IDs now properly in TILE_IDS object');

// Now add plant info to TILE_INFO
let content2 = fs.readFileSync(tileIdsPath, 'utf8');
const tileInfoClosing = content2.lastIndexOf('};');
let plantInfo = '';
for (let i = 1081; i <= 2601; i++) {
  const plantIndex = i - 1081;
  plantInfo += `  ${i}: { name: "plant_${plantIndex}", image: "Plants.png" },\n`;
}

const beforeInfo = content2.substring(0, tileInfoClosing - 1);
if (beforeInfo.endsWith(',\n')) {
  // Good, keep it as is
  const finalContent = beforeInfo + ',\n' + plantInfo + '};';
  fs.writeFileSync(tileIdsPath, finalContent, 'utf8');
} else {
  const finalContent = beforeInfo + ',\n' + plantInfo + '};';
  fs.writeFileSync(tileIdsPath, finalContent, 'utf8');
}

console.log('✓ Added 1521 plant entries to TILE_INFO (1081-2601)');
