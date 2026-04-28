// ══════════════════════════════════════════════════════════
//  REALM 5 — dense obstacle route
// ══════════════════════════════════════════════════════════

import {
  G, TG, TG2, PTH, TREE, TR2, TR3, RK, RK3,
  createBaseMap, paintLine, paintColumn, paintRect, paint,
  carveSideGate, carveVerticalGate, applyOverrides
} from './constants.js';

function createMap5Base() {
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

  return map5;
}

const map5Overrides = [];

export function getMap5() {
  const map5 = createMap5Base();
  applyOverrides(map5, map5Overrides);
  return map5;
}
