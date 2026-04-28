// ══════════════════════════════════════════════════════════
//  MAIN MAPS MODULE
// ══════════════════════════════════════════════════════════

import { getMap1 } from './maps/map1.js';
import { getMap2 } from './maps/map2.js';
import { getMap5 } from './maps/map5.js';
import { getMap6 } from './maps/map6.js';

// Build all maps by calling their getter functions
const map1 = getMap1();
const map2 = getMap2();
const map5 = getMap5();
const map6 = getMap6();

// Export as unified interface
export const maps = { map1, map2, map5, map6 };