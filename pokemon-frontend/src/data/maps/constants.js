// ══════════════════════════════════════════════════════════
//  MAPS CONSTANTS & HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════

// Basic tile IDs
export const G   = 88;   // grass (walkable, ground.png)
export const G2  = 89;   // grass variant
export const SND = 90;   // sand
export const SND2= 108;  // darker sand
export const DRT = 109;  // dirt
export const PTH = 110;  // stone path
export const TG  = 92;   // tall grass (encounter)
export const TG2 = 93;   // tall grass variant
export const CROP_FIELD = 38; // crop field tile
export const RK  = 753;  // rock border (non-walkable)
export const RK2 = 754;
export const RK3 = 761;  // darker rock
export const RK4 = 769;  // big rock
export const TREE= 927;  // tree (non-walkable, trees4.png)
export const TR2 = 928;
export const TR3 = 929;
export const TR4 = 930;
export const PLANT_5 = 1086;

// Trigger/tile IDs

export const DOOR_UP = 1087;
export const DOOR_DOWN = 1088;
export const DOOR_LEFT = 1089;
export const DOOR_RIGHT = 1090;
export const PATH_DARK = 1092;
export const HAY_BALE = 1093;
export const WINDOW = 1094;
export const SIGN = 1095;
export const POT = 1096;
export const TABLE = 1098;
export const CHAIR = 1099;
export const BED = 1100;
export const FENCE_WOOD = 1101;
export const FENCE_GATE = 1102;
export const PATH_BRICK = 1103;
export const WALL_WOOD = 1104;
export const NPC_TRIGGER = 1105;

export const SIZE = 30;

// ══════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════

export function createBaseMap(baseFloor = G) {
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => {
      if (y === 0 || y === SIZE - 1 || x === 0 || x === SIZE - 1) {
        return RK; // rock border
      }
      return baseFloor;
    })
  );
}

export function paint(targetMap, coords, value) {
  coords.forEach(([x, y]) => {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  });
}

export function paintLine(targetMap, fromX, toX, y, value) {
  for (let x = fromX; x <= toX; x++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

export function paintColumn(targetMap, x, fromY, toY, value) {
  for (let y = fromY; y <= toY; y++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

export function paintRect(targetMap, fromX, toX, fromY, toY, value) {
  for (let y = fromY; y <= toY; y++) {
    for (let x = fromX; x <= toX; x++) {
      if (targetMap[y] && targetMap[y][x] !== undefined) {
        targetMap[y][x] = value;
      }
    }
  }
}

export function setTile(targetMap, x, y, tileId) {
  if (targetMap[y] && targetMap[y][x] !== undefined) {
    targetMap[y][x] = tileId;
  }
}

export function carveSideGate(targetMap, side, fromY, toY, value = G) {
  const x = side === "left" ? 0 : targetMap[0].length - 1;
  for (let y = fromY; y <= toY; y++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

export function carveVerticalGate(targetMap, side, fromX, toX, value = G) {
  const y = side === "top" ? 0 : targetMap.length - 1;
  for (let x = fromX; x <= toX; x++) {
    if (targetMap[y] && targetMap[y][x] !== undefined) {
      targetMap[y][x] = value;
    }
  }
}

export function applyOverrides(targetMap, overrides) {
  overrides.forEach(([x, y, id]) => setTile(targetMap, x, y, id));
}
