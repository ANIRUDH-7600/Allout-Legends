// pokemon-frontend/scripts/parse-pokemon.cjs
const fs = require('fs');
const path = require('path');

const INI_PATH = path.join(__dirname, '../public/data/pokemon.ini');
const OUTPUT_DIR = path.join(__dirname, '../src/data/pokemon');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read INI file
const iniContent = fs.readFileSync(INI_PATH, 'utf8');

// Parse INI format
function parseINI(iniText) {
  const result = {};
  let currentSection = null;
  let currentPokemon = null;
  
  const lines = iniText.split(/\r?\n/);
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith(';') || trimmed === '') continue;
    
    // Check for section header [001]
    const sectionMatch = trimmed.match(/^\[(\d+)\]/);
    if (sectionMatch) {
      const pokemonId = sectionMatch[1];
      currentSection = pokemonId;
      result[currentSection] = {};
      currentPokemon = result[currentSection];
      continue;
    }
    
    // Parse key=value pairs
    const kvMatch = trimmed.match(/^([^=]+)=(.*)$/);
    if (kvMatch && currentPokemon) {
      let key = kvMatch[1].trim();
      let value = kvMatch[2].trim();
      
      // Parse special fields
      if (key === 'BaseStats') {
        const stats = value.split(',');
        currentPokemon.BaseStats = {
          hp: parseInt(stats[0]),
          attack: parseInt(stats[1]),
          defense: parseInt(stats[2]),
          speed: parseInt(stats[3]),
          spAttack: parseInt(stats[4]),
          spDefense: parseInt(stats[5])
        };
      } 
      else if (key === 'Moves') {
        const moves = [];
        const movePairs = value.split(',');
        for (let i = 0; i < movePairs.length; i += 2) {
          moves.push({
            level: parseInt(movePairs[i]),
            name: movePairs[i + 1]
          });
        }
        currentPokemon.Moves = moves;
      }
      else if (key === 'Type1' || key === 'Type2') {
        currentPokemon[key] = value;
      }
      else if (key === 'Evolution') {
        if (value && value !== '') {
          const evoParts = value.split(',');
          currentPokemon.Evolution = {
            to: evoParts[0],
            method: evoParts[1],
            value: evoParts[2] ? parseInt(evoParts[2]) : null
          };
        }
      }
      else if (key === 'BaseEXP' || key === 'Rareness' || key === 'Happiness') {
        currentPokemon[key] = parseInt(value);
      }
      else {
        currentPokemon[key] = value;
      }
    }
  }
  
  return result;
}

console.log('📖 Parsing pokemon.ini...');
const pokemonData = parseINI(iniContent);
console.log(`✅ Loaded ${Object.keys(pokemonData).length} Pokémon`);

// Generate pokemonData.js
const outputData = `// Auto-generated from pokemon.ini
// Generated: ${new Date().toLocaleString()}

export const POKEMON_DATA = ${JSON.stringify(pokemonData, null, 2)};

// Helper to get Pokémon by ID
export function getPokemonById(id) {
  const paddedId = id.toString().padStart(3, '0');
  return POKEMON_DATA[paddedId];
}

// Helper to get Pokémon by name
export function getPokemonByName(name) {
  return Object.values(POKEMON_DATA).find(p => p.Name?.toLowerCase() === name.toLowerCase());
}

// Get random Pokémon by region/rarity
export function getRandomPokemon(minRarity = 0, maxRarity = 255) {
  const available = Object.values(POKEMON_DATA).filter(p => 
    p.Rareness >= minRarity && p.Rareness <= maxRarity
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export default POKEMON_DATA;
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'pokemonData.js'), outputData);
console.log('✅ Generated pokemonData.js');

// Generate battle helpers
const battleHelpers = `// Battle calculation helpers
import { POKEMON_DATA } from './pokemonData.js';

// Type effectiveness chart (Gen 1-4 standard)
export const TYPE_EFFECTIVENESS = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Dark: 2, Steel: 2 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Grass: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Steel: { Ice: 2, Rock: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 }
};

// Calculate damage
export function calculateDamage(move, attacker, defender) {
  // Base power based on move (simplified)
  const movePower = move.power || 40;
  
  // Attack/Defense ratio
  const attackStat = move.category === 'physical' ? attacker.attack : attacker.spAttack;
  const defenseStat = move.category === 'physical' ? defender.defense : defender.spDefense;
  
  // Level factor
  const level = attacker.level || 5;
  
  // Type effectiveness
  let effectiveness = 1;
  if (move.type) {
    effectiveness = TYPE_EFFECTIVENESS[move.type]?.[defender.type1] || 1;
    if (defender.type2) {
      effectiveness *= TYPE_EFFECTIVENESS[move.type]?.[defender.type2] || 1;
    }
  }
  
  // STAB (Same Type Attack Bonus)
  const stab = (move.type === attacker.type1 || move.type === attacker.type2) ? 1.5 : 1;
  
  // Random factor (85-100%)
  const random = 0.85 + Math.random() * 0.15;
  
  // Damage formula
  let damage = ((2 * level / 5 + 2) * movePower * (attackStat / defenseStat) / 50 + 2) * stab * effectiveness * random;
  
  return Math.max(1, Math.floor(damage));
}

// Calculate HP based on level and base stats
export function calculateHP(baseHP, level) {
  return Math.floor((2 * baseHP * level) / 100) + level + 10;
}

// Calculate other stats
export function calculateStat(baseStat, level) {
  return Math.floor((2 * baseStat * level) / 100) + 5;
}

// Get Pokémon sprite URL
export function getPokemonSprite(id) {
  const paddedId = id.toString().padStart(3, '0');
  return \`/assets/pokemons/\${paddedId}.png\`;
}

// Generate wild Pokémon instance
export function generateWildPokemon(pokemonData, level = null) {
  const baseLevel = level || Math.floor(Math.random() * 10) + 2;
  
  const hp = calculateHP(pokemonData.BaseStats.hp, baseLevel);
  
  return {
    id: pokemonData.InternalName,
    name: pokemonData.Name,
    level: baseLevel,
    hp: hp,
    maxHp: hp,
    attack: calculateStat(pokemonData.BaseStats.attack, baseLevel),
    defense: calculateStat(pokemonData.BaseStats.defense, baseLevel),
    spAttack: calculateStat(pokemonData.BaseStats.spAttack, baseLevel),
    spDefense: calculateStat(pokemonData.BaseStats.spDefense, baseLevel),
    speed: calculateStat(pokemonData.BaseStats.speed, baseLevel),
    type1: pokemonData.Type1,
    type2: pokemonData.Type2,
    moves: (pokemonData.Moves || []).filter(m => m.level <= baseLevel).slice(-4),
    sprite: getPokemonSprite(pokemonData.InternalName),
    xp: 0,
    xpToNext: Math.floor((pokemonData.GrowthRate === 'Medium' ? 100 : 80) * baseLevel / 2)
  };
}
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'battleHelpers.js'), battleHelpers);
console.log('✅ Generated battleHelpers.js');

console.log('\n✨ Complete! Files generated in src/data/pokemon/');