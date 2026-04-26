// pokemon-frontend/scripts/extract-tiles.cjs
const fs = require('fs');
const path = require('path');

// Get the tiles directory
const tilesDir = path.join(__dirname, '../public/assets/tiles/');

console.log('📍 Scanning for tiles in:', tilesDir);
console.log('');

// Check if directory exists
if (!fs.existsSync(tilesDir)) {
    console.error('❌ Tiles directory not found!');
    process.exit(1);
}

// Get all PNG files first
const allFiles = fs.readdirSync(tilesDir);
const imageFiles = allFiles.filter(f => f.endsWith('.png') || f.endsWith('.PNG'));
const tsxFiles = allFiles.filter(f => f.endsWith('.tsx'));

console.log(`📸 Found ${imageFiles.length} image files:`);
imageFiles.forEach(f => console.log(`   - ${f}`));
console.log('');

console.log(`📄 Found ${tsxFiles.length} TSX files:`);
tsxFiles.forEach(f => console.log(`   - ${f}`));
console.log('');

let globalId = 0;
const tileMap = {};

tsxFiles.forEach(file => {
    console.log(`\n📄 Parsing ${file}`);
    console.log('━'.repeat(50));
    
    const filePath = path.join(tilesDir, file);
    let content;
    
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`   ❌ Could not read ${file}`);
        return;
    }
    
    // Extract image source
    const imgMatch = content.match(/<image source="([^"]+)"/);
    const imageName = imgMatch ? imgMatch[1] : file.replace('.tsx', '.png');
    console.log(`   🖼️  Image: ${imageName}`);
    
    // Extract tile dimensions
    const widthMatch = content.match(/tilewidth="(\d+)"/);
    const heightMatch = content.match(/tileheight="(\d+)"/);
    const countMatch = content.match(/tilecount="(\d+)"/);
    const colsMatch = content.match(/columns="(\d+)"/);
    
    const tileWidth = widthMatch ? widthMatch[1] : '32';
    const tileHeight = heightMatch ? heightMatch[1] : '32';
    const tileCount = countMatch ? parseInt(countMatch[1]) : 0;
    const columns = colsMatch ? parseInt(colsMatch[1]) : 16;
    const rows = Math.ceil(tileCount / columns);
    
    console.log(`   📏 Size: ${tileWidth}x${tileHeight}`);
    console.log(`   🔢 Tile count: ${tileCount}`);
    console.log(`   📐 Grid: ${columns}x${rows}`);
    console.log(`   🎯 Global IDs: ${globalId} → ${globalId + tileCount - 1}`);
    console.log('');
    
    // Extract tile properties (names)
    const tileRegex = /<tile id="(\d+)"[^>]*>[\s\S]*?<property name="([^"]+)" value="([^"]+)"/g;
    let match;
    let hasProperties = false;
    const namedTiles = [];
    
    while ((match = tileRegex.exec(content)) !== null) {
        hasProperties = true;
        const localId = parseInt(match[1]);
        const globalId_assigned = globalId + localId;
        const tileName = match[3];
        
        namedTiles.push({
            id: globalId_assigned,
            localId: localId,
            name: tileName
        });
        
        tileMap[globalId_assigned] = {
            name: tileName,
            image: imageName,
            file: file,
            localId: localId
        };
    }
    
    // Display first 10 named tiles
    if (hasProperties) {
        console.log(`   📝 Named tiles (${namedTiles.length} total, showing first 10):`);
        namedTiles.slice(0, 10).forEach(tile => {
            console.log(`      ID ${tile.id}: ${tile.name}`);
        });
        if (namedTiles.length > 10) {
            console.log(`      ... and ${namedTiles.length - 10} more`);
        }
    } else {
        // Generate generic names
        console.log(`   📝 No named properties, generating generic names...`);
        const baseName = path.basename(file, '.tsx');
        for (let i = 0; i < tileCount; i++) {
            const globalId_assigned = globalId + i;
            tileMap[globalId_assigned] = {
                name: `${baseName}_${i}`,
                image: imageName,
                file: file,
                localId: i
            };
        }
        console.log(`   Generated ${tileCount} generic tile names`);
    }
    
    globalId += tileCount;
    console.log('');
});

// Ensure src/data directory exists
const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Save JSON mapping
const outputJson = path.join(dataDir, 'tileMap.json');
fs.writeFileSync(outputJson, JSON.stringify(tileMap, null, 2));
console.log(`💾 Saved JSON mapping to: ${outputJson}`);

// Save as JavaScript module
const outputJs = path.join(dataDir, 'tileIds.js');
let jsContent = `// Auto-generated tile IDs\n`;
jsContent += `// Total tiles: ${globalId}\n`;
jsContent += `// Generated: ${new Date().toLocaleString()}\n\n`;

jsContent += `export const TILE_IDS = {\n`;

// Group by file for better organization
const byFile = {};
Object.keys(tileMap).forEach(id => {
    const tile = tileMap[id];
    if (!byFile[tile.file]) byFile[tile.file] = [];
    byFile[tile.file].push({ id, name: tile.name });
});

Object.keys(byFile).forEach(file => {
    jsContent += `  // ${file}\n`;
    byFile[file].forEach(tile => {
        // Create a valid JavaScript constant name
        let constName = tile.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        // Remove duplicate underscores
        constName = constName.replace(/_+/g, '_');
        // Remove trailing underscore
        constName = constName.replace(/_$/, '');
        jsContent += `  ${constName}: ${tile.id},\n`;
    });
    jsContent += `\n`;
});

jsContent += `};\n\n`;
jsContent += `export const TILE_INFO = {\n`;
Object.keys(tileMap).forEach(id => {
    const tile = tileMap[id];
    jsContent += `  ${id}: { name: "${tile.name}", image: "${tile.image}", file: "${tile.file}" },\n`;
});
jsContent += `};\n\n`;
jsContent += `// Helper function to get tile info\nexport function getTileInfo(id) {\n`;
jsContent += `  return TILE_INFO[id] || { name: "Unknown", image: "unknown", file: "unknown" };\n`;
jsContent += `}\n`;

fs.writeFileSync(outputJs, jsContent);
console.log(`💾 Saved JS module to: ${outputJs}`);

// Generate a simple text reference
const textRef = path.join(dataDir, 'TILE_REFERENCE.txt');
let textContent = '═'.repeat(60) + '\n';
textContent += '           ALLOUT-LEGENDS TILE ID REFERENCE\n';
textContent += '═'.repeat(60) + '\n\n';

// Group by ID ranges
const ranges = {};
Object.keys(tileMap).forEach(id => {
    const numId = parseInt(id);
    const file = tileMap[id].file || 'unknown';
    if (!ranges[file]) {
        ranges[file] = { min: numId, max: numId, count: 0 };
    }
    ranges[file].min = Math.min(ranges[file].min, numId);
    ranges[file].max = Math.max(ranges[file].max, numId);
    ranges[file].count++;
});

textContent += '📊 TILESET ID RANGES:\n\n';
Object.keys(ranges).forEach(file => {
    const r = ranges[file];
    textContent += `   ${file}:\n`;
    textContent += `      IDs: ${r.min} → ${r.max}\n`;
    textContent += `      Count: ${r.count} tiles\n\n`;
});

textContent += '\n📝 COMPLETE TILE LIST:\n\n';
Object.keys(tileMap).sort((a,b) => parseInt(a) - parseInt(b)).forEach(id => {
    const tile = tileMap[id];
    textContent += `   ${id.toString().padStart(4)}: ${tile.name.padEnd(40)} (${tile.image})\n`;
});

fs.writeFileSync(textRef, textContent);
console.log(`📝 Saved text reference to: ${textRef}`);

// Generate a master tileset config
const masterConfigPath = path.join(dataDir, 'masterTileset.js');
let masterContent = `// Auto-generated Master Tileset Configuration\n`;
masterContent += `// Total tiles: ${globalId}\n`;
masterContent += `// Generated: ${new Date().toLocaleString()}\n\n`;

masterContent += `export const MASTER_TILESET = {\n`;
masterContent += `  renderSize: 64,\n`;
masterContent += `  tilesets: [\n`;

let currentStart = 0;
tsxFiles.forEach(file => {
    const filePath = path.join(tilesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const countMatch = content.match(/tilecount="(\d+)"/);
    const tileCount = countMatch ? parseInt(countMatch[1]) : 0;
    const imgMatch = content.match(/<image source="([^"]+)"/);
    const imageName = imgMatch ? imgMatch[1] : file.replace('.tsx', '.png');
    const widthMatch = content.match(/tilewidth="(\d+)"/);
    const tileWidth = widthMatch ? parseInt(widthMatch[1]) : 32;
    
    masterContent += `    {\n`;
    masterContent += `      id: "${path.basename(file, '.tsx')}",\n`;
    masterContent += `      name: "${path.basename(file, '.tsx')}",\n`;
    masterContent += `      imagePath: "/assets/tiles/${imageName}",\n`;
    masterContent += `      tileWidth: ${tileWidth},\n`;
    masterContent += `      tileHeight: ${tileWidth},\n`;
    masterContent += `      startId: ${currentStart},\n`;
    masterContent += `      endId: ${currentStart + tileCount - 1},\n`;
    masterContent += `      walkable: true,\n`;
    masterContent += `      encounterRate: 0.05,\n`;
    masterContent += `    },\n`;
    currentStart += tileCount;
});

masterContent += `  ],\n};\n\n`;
masterContent += `export default MASTER_TILESET;\n`;

fs.writeFileSync(masterConfigPath, masterContent);
console.log(`💾 Saved master tileset config to: ${masterConfigPath}`);

console.log('\n✨ COMPLETE!');
console.log(`📊 Total tiles processed: ${globalId}`);
console.log('\nGenerated files:');
console.log(`   📁 ${outputJson}`);
console.log(`   📁 ${outputJs}`);
console.log(`   📁 ${textRef}`);
console.log(`   📁 ${masterConfigPath}`);
console.log('\nYou can now import tile IDs in your code:');
console.log(`   import { TILE_IDS } from './data/tileIds';`);
console.log(`   console.log(TILE_IDS.GROUND_0); // First ground tile`);