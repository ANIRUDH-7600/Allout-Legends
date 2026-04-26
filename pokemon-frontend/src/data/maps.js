const SIZE = 30;

function createBaseMap() {
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => {
      if (y === 0 || y === SIZE - 1 || x === 0 || x === SIZE - 1) {
        return 1; // rock border
      }
      return 3; // normal grass
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

function carveSideGate(targetMap, side, fromY, toY, value = 0) {
  const x = side === "left" ? 0 : targetMap[0].length - 1;
  for (let y = fromY; y <= toY; y++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

function carveVerticalGate(targetMap, side, fromX, toX, value = 0) {
  const y = side === "top" ? 0 : targetMap.length - 1;
  for (let x = fromX; x <= toX; x++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

const map1 = createBaseMap();
const map2 = createBaseMap();
const map5 = createBaseMap();
const map6 = createBaseMap();

// Realm 1: designed starter route (paths + trees + bushes + pond + flowers + tall grass).
paintLine(map1, 1, 28, 14, 0);
paintLine(map1, 1, 28, 15, 0);
paintColumn(map1, 14, 1, 28, 18);
paintColumn(map1, 15, 1, 28, 18);

// Keep V1 connections: right gate to Realm 2, bottom gate to Realm 5.
carveSideGate(map1, "right", 14, 15, 0);
carveVerticalGate(map1, "bottom", 14, 15, 0);

// Mark gate corridors with path tiles for readability.
paintLine(map1, 24, 29, 14, 0);
paintLine(map1, 24, 29, 15, 0);
paintColumn(map1, 14, 20, 29, 0);
paintColumn(map1, 15, 20, 29, 0);

// Side paths and loops.
paintLine(map1, 4, 14, 8, 28);
paintLine(map1, 15, 24, 20, 28);
paintColumn(map1, 6, 8, 20, 28);
paintColumn(map1, 22, 14, 20, 0);

// Tree groves.
paintRect(map1, 1, 5, 4, 11, 6);
paintRect(map1, 2, 4, 5, 10, 9);
paintRect(map1, 20, 26, 4, 8, 8);
paintRect(map1, 21, 25, 5, 7, 9);
paint(map1, [[3, 4], [4, 4], [5, 4]], 7);
paint(map1, [[21, 8], [22, 8], [23, 8]], 29);

// Bush lines that create detours.
paintRect(map1, 10, 13, 10, 10, 9);
paintRect(map1, 16, 19, 18, 18, 9);
paintRect(map1, 10, 12, 11, 11, 31);
paintRect(map1, 16, 18, 19, 19, 32);

// Pond feature (non-walkable) with nearby flowers.
paintRect(map1, 8, 10, 18, 20, 15);
paint(map1, [[9, 19]], 19);
paint(map1, [[7, 17], [10, 17], [7, 20], [10, 20]], 4);
paint(map1, [[8, 17], [9, 17]], 22);

// Small landmark cluster near center route.
paint(map1, [[17, 13]], 16); // sign
paint(map1, [[16, 13], [18, 13]], 11); // lamps
paint(map1, [[18, 12], [19, 12], [20, 12]], 14); // fence

// Tall-grass encounter pockets.
paintRect(map1, 23, 26, 16, 19, 2);
paintRect(map1, 3, 5, 22, 24, 2);
paintRect(map1, 24, 26, 4, 6, 23);

// Rocks as small blockers.
paint(map1, [[12, 12], [24, 13], [11, 21]], 5);
paint(map1, [[18, 9]], 27);

// Route 2: town connector with shops and fence chokepoints.
paintLine(map2, 0, 29, 14, 0);
paintLine(map2, 0, 29, 15, 0);
paintColumn(map2, 14, 3, 26, 0);
paintColumn(map2, 15, 3, 26, 0);
carveSideGate(map2, "left", 14, 15, 0);
carveVerticalGate(map2, "bottom", 14, 15, 0);
paintColumn(map2, 14, 15, 29, 0);
paintColumn(map2, 15, 15, 29, 0);

// Building strip (obstacles).
paintRect(map2, 18, 26, 7, 7, 14); // fence

// Tall grass fields separated by path.
paintRect(map2, 4, 8, 5, 9, 2);
paintRect(map2, 4, 8, 18, 22, 2);
paintRect(map2, 18, 23, 18, 22, 2);

// Barricade barrier that forces detour around center-right.
paintRect(map2, 16, 22, 12, 12, 10);
paint(map2, [[19, 12], [19, 13], [19, 14]], 0);

// Realm 5: denser obstacle route with narrow passages.
paintLine(map5, 0, 10, 14, 0);
paintLine(map5, 0, 10, 15, 0);
paintColumn(map5, 10, 14, 24, 0);
paintLine(map5, 10, 24, 24, 0);
paintColumn(map5, 24, 10, 24, 0);
paintLine(map5, 10, 24, 10, 0);
carveSideGate(map5, "right", 14, 15, 0);
carveVerticalGate(map5, "top", 14, 15, 0);
paintColumn(map5, 14, 0, 10, 0);
paintColumn(map5, 15, 0, 10, 0);

// Obstacle islands.
paintRect(map5, 3, 8, 5, 10, 7);
paintRect(map5, 4, 7, 6, 9, 9);
paintRect(map5, 15, 20, 12, 17, 6);
paintRect(map5, 16, 19, 13, 16, 9);
paintRect(map5, 21, 27, 20, 22, 10);

// Passages and encounter patches.
paint(map5, [[13, 10], [14, 10], [15, 10], [20, 24], [21, 24], [22, 24]], 0);
paintRect(map5, 11, 13, 18, 20, 2);
paintRect(map5, 25, 27, 12, 14, 2);

// Props.
paint(map5, [[9, 22], [14, 18], [23, 17]], 5);   // rocks

// Realm 6: mixed route with tree barriers and a central detour.
paintLine(map6, 0, 29, 14, 0);
paintLine(map6, 0, 29, 15, 0);
paintColumn(map6, 14, 0, 29, 0);
paintColumn(map6, 15, 0, 29, 0);
carveSideGate(map6, "left", 14, 15, 0);
carveVerticalGate(map6, "top", 14, 15, 0);

paintRect(map6, 4, 9, 5, 10, 6);
paintRect(map6, 5, 8, 6, 9, 9);
paintRect(map6, 20, 25, 6, 11, 8);
paintRect(map6, 21, 24, 7, 10, 9);
paintRect(map6, 10, 19, 20, 21, 10);
paint(map6, [[14, 20], [15, 20]], 0);
paintRect(map6, 11, 13, 17, 19, 2);
paintRect(map6, 17, 19, 17, 19, 2);
paint(map6, [[12, 12], [18, 12], [23, 16], [7, 18]], 5);
paint(map6, [[9, 14], [20, 15], [16, 8]], 4);

// Per-tile manual editing layer.
// Format: [x, y, tileId] where tileId is atlas id 0..49.
// Add/remove entries below to change any tile individually.
const tileOverrides = {
  map1: [],
  map2: [],
  map5: [],
  map6: [],
};

applyTileOverrides(map1, tileOverrides.map1);
applyTileOverrides(map2, tileOverrides.map2);
applyTileOverrides(map5, tileOverrides.map5);
applyTileOverrides(map6, tileOverrides.map6);

export const maps = {
  map1,
  map2,
  map5,
  map6
};