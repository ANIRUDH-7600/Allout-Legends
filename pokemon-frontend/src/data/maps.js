// pokemon-frontend/src/data/maps.js
//
// Tile ID reference (from masterTileset.js):
//   fence-snow  : 0   – 87   (non-walkable, fence-snow.png, 8 cols)
//   ground      : 88  – 227  (walkable,     ground.png,     20 cols)
//   houses-snow : 228 – 395  (non-walkable, houses-snow.png)
//   houses      : 396 – 720  (non-walkable, houses.png)
//   rock-snow   : 721 – 752  (non-walkable)
//   rocks       : 753 – 856  (non-walkable, rocks.png, 8 cols)
//   trees-snow  : 857 – 926  (non-walkable)
//   trees       : 927 – 1070 (non-walkable, trees4.png)
//   triggers    : 1071– 1080 (walkable)
//
// ── Commonly used tile IDs ─────────────────────────────
//   GRASS        = 88   (ground_0,  green grass base)
//   GRASS2       = 89   (ground_1,  slightly different green)
//   SAND         = 90   (ground_2,  sandy terrain)
//   SAND2        = 108  (ground_20, darker sand)
//   DIRT         = 109  (ground_21, brown dirt)
//   PATH         = 110  (ground_22, light stone path)
//   TALL_GRASS   = 92   (ground_4,  encounter-triggering tall grass)
//   ROCK_BORDER  = 753  (rocks_0,   solid rock wall / border)
//   ROCK2        = 754  (rocks_1)
//   ROCK3        = 755  (rocks_2)
//   ROCK_DARK    = 761  (rocks_8)
//   ROCK_BIG     = 769  (rocks_16)
//   FENCE        = 0    (fence-snow_0)

const G   = 88;   // grass (walkable, ground.png)
const G2  = 89;   // grass variant
const SND = 90;   // sand
const SND2= 108;  // darker sand
const DRT = 109;  // dirt
const PTH = 110;  // stone path
const TG  = 92;   // tall grass (encounter)
const TG2 = 93;   // tall grass variant
const RK  = 753;  // rock border (non-walkable)
const RK2 = 754;
const RK3 = 761;  // darker rock
const RK4 = 769;  // big rock
const TREE= 927;  // tree (non-walkable, trees4.png)
const TR2 = 928;
const TR3 = 929;
const TR4 = 930;
const FNC = 0;    // fence-snow (non-walkable)

const SIZE = 30;

function createBaseMap(baseFloor = G) {
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => {
      if (y === 0 || y === SIZE - 1 || x === 0 || x === SIZE - 1) {
        return RK; // rock border
      }
      return baseFloor;
    })
  );
}

function paint(targetMap, coords, value) {
  coords.forEach(([x, y]) => {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  });
}

function paintLine(targetMap, fromX, toX, y, value) {
  for (let x = fromX; x <= toX; x++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

function paintColumn(targetMap, x, fromY, toY, value) {
  for (let y = fromY; y <= toY; y++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

function paintRect(targetMap, fromX, toX, fromY, toY, value) {
  for (let y = fromY; y <= toY; y++) {
    for (let x = fromX; x <= toX; x++) {
      if (targetMap[y] && targetMap[y][x] !== undefined) {
        targetMap[y][x] = value;
      }
    }
  }
}

function setTile(targetMap, x, y, tileId) {
  if (targetMap[y] && targetMap[y][x] !== undefined) {
    targetMap[y][x] = tileId;
  }
}

function applyTileOverrides(targetMap, overrides) {
  overrides.forEach(([x, y, tileId]) => {
    setTile(targetMap, x, y, tileId);
  });
}

function carveSideGate(targetMap, side, fromY, toY, value = G) {
  const x = side === "left" ? 0 : targetMap[0].length - 1;
  for (let y = fromY; y <= toY; y++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

function carveVerticalGate(targetMap, side, fromX, toX, value = G) {
  const y = side === "top" ? 0 : targetMap.length - 1;
  for (let x = fromX; x <= toX; x++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

// ══════════════════════════════════════════════════════════
//  REALM 1 — starter route
// ══════════════════════════════════════════════════════════
const map1 = createBaseMap(G);

// Main horizontal + vertical paths
paintLine(map1, 1, 28, 14, PTH);
paintLine(map1, 1, 28, 15, PTH);
paintColumn(map1, 14, 1, 28, PTH);
paintColumn(map1, 15, 1, 28, PTH);

// Gates
carveSideGate(map1, "right", 14, 15, PTH);
carveVerticalGate(map1, "bottom", 14, 15, PTH);

// Approach corridors
paintLine(map1, 24, 29, 14, PTH);
paintLine(map1, 24, 29, 15, PTH);
paintColumn(map1, 14, 20, 29, PTH);
paintColumn(map1, 15, 20, 29, PTH);

// Side paths
paintLine(map1, 4, 14, 8, SND);
paintLine(map1, 15, 24, 20, SND);
paintColumn(map1, 6, 8, 20, SND);
paintColumn(map1, 22, 14, 20, PTH);

// Tree groves (non-walkable)
paintRect(map1, 1, 5, 4, 11, TREE);
paintRect(map1, 2, 4, 5, 10, TR2);
paintRect(map1, 20, 26, 4, 8, TREE);
paintRect(map1, 21, 25, 5, 7, TR3);
paint(map1, [[3,4],[4,4],[5,4]], TR4);
paint(map1, [[21,8],[22,8],[23,8]], TR2);

// Bush/shrub lines
paintRect(map1, 10, 13, 10, 10, TR3);
paintRect(map1, 16, 19, 18, 18, TR3);
paintRect(map1, 10, 12, 11, 11, TR4);
paintRect(map1, 16, 18, 19, 19, TR2);

// Pond area (sand base) with surrounding grass
paintRect(map1, 8, 10, 18, 20, SND2);
paint(map1, [[9,19]], DRT);
paint(map1, [[7,17],[10,17],[7,20],[10,20]], G2);
paint(map1, [[8,17],[9,17]], TG);

// Tall-grass encounter pockets
paintRect(map1, 23, 26, 16, 19, TG);
paintRect(map1, 3, 5, 22, 24, TG);
paintRect(map1, 24, 26, 4, 6, TG2);

// Rock blockers
paint(map1, [[12,12],[24,13],[11,21]], RK2);
paint(map1, [[18,9]], RK4);

// ══════════════════════════════════════════════════════════
//  REALM 2 — town connector
// ══════════════════════════════════════════════════════════
const map2 = createBaseMap(G);

paintLine(map2, 0, 29, 14, PTH);
paintLine(map2, 0, 29, 15, PTH);
paintColumn(map2, 14, 3, 26, PTH);
paintColumn(map2, 15, 3, 26, PTH);
carveSideGate(map2, "left", 14, 15, PTH);
carveVerticalGate(map2, "bottom", 14, 15, PTH);
paintColumn(map2, 14, 15, 29, PTH);
paintColumn(map2, 15, 15, 29, PTH);

// Fence line
paintRect(map2, 18, 26, 7, 7, FNC);

// Tall grass fields
paintRect(map2, 4, 8, 5, 9, TG);
paintRect(map2, 4, 8, 18, 22, TG);
paintRect(map2, 18, 23, 18, 22, TG2);

// Rock barrier with gap
paintRect(map2, 16, 22, 12, 12, RK);
paint(map2, [[19,12],[19,13],[19,14]], PTH);

// Tree borders
paintRect(map2, 1, 3, 2, 12, TREE);
paintRect(map2, 24, 28, 2, 12, TR2);

// ══════════════════════════════════════════════════════════
//  REALM 5 — dense obstacle route
// ══════════════════════════════════════════════════════════
const map5 = createBaseMap(G);

paintLine(map5, 0, 10, 14, PTH);
paintLine(map5, 0, 10, 15, PTH);
paintColumn(map5, 10, 14, 24, PTH);
paintLine(map5, 10, 24, 24, PTH);
paintColumn(map5, 24, 10, 24, PTH);
paintLine(map5, 10, 24, 10, PTH);
carveSideGate(map5, "right", 14, 15, PTH);
carveVerticalGate(map5, "top", 14, 15, PTH);
paintColumn(map5, 14, 0, 10, PTH);
paintColumn(map5, 15, 0, 10, PTH);

// Obstacle islands
paintRect(map5, 3, 8, 5, 10, TREE);
paintRect(map5, 4, 7, 6, 9, TR2);
paintRect(map5, 15, 20, 12, 17, TREE);
paintRect(map5, 16, 19, 13, 16, TR3);
paintRect(map5, 21, 27, 20, 22, RK);

// Passages and encounter patches
paint(map5, [[13,10],[14,10],[15,10],[20,24],[21,24],[22,24]], PTH);
paintRect(map5, 11, 13, 18, 20, TG);
paintRect(map5, 25, 27, 12, 14, TG2);

// Props
paint(map5, [[9,22],[14,18],[23,17]], RK3);

// ══════════════════════════════════════════════════════════
//  REALM 6 — mixed route
// ══════════════════════════════════════════════════════════
const map6 = createBaseMap(G);

paintLine(map6, 0, 29, 14, PTH);
paintLine(map6, 0, 29, 15, PTH);
paintColumn(map6, 14, 0, 29, PTH);
paintColumn(map6, 15, 0, 29, PTH);
carveSideGate(map6, "left", 14, 15, PTH);
carveVerticalGate(map6, "top", 14, 15, PTH);

paintRect(map6, 4, 9, 5, 10, TREE);
paintRect(map6, 5, 8, 6, 9, TR2);
paintRect(map6, 20, 25, 6, 11, TR3);
paintRect(map6, 21, 24, 7, 10, TR4);
paintRect(map6, 10, 19, 20, 21, RK);
paint(map6, [[14,20],[15,20]], PTH);
paintRect(map6, 11, 13, 17, 19, TG);
paintRect(map6, 17, 19, 17, 19, TG2);
paint(map6, [[12,12],[18,12],[23,16],[7,18]], RK2);
paint(map6, [[9,14],[20,15],[16,8]], G2);

// ══════════════════════════════════════════════════════════
//  Manual tile overrides — add [x, y, tileId] entries here
// ══════════════════════════════════════════════════════════
const tileOverrides = {
  map1: [],
  map2: [],
  map5: [],
  map6: [],
};

function applyAll(targetMap, overrides) {
  overrides.forEach(([x, y, id]) => setTile(targetMap, x, y, id));
}

applyAll(map1, tileOverrides.map1);
applyAll(map2, tileOverrides.map2);
applyAll(map5, tileOverrides.map5);
applyAll(map6, tileOverrides.map6);

export const maps = { map1, map2, map5, map6 };