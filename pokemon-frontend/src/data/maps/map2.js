// ══════════════════════════════════════════════════════════
//  REALM 2 — town connector
// ══════════════════════════════════════════════════════════

import {
  G, TG, TG2, PTH, TREE, TR2, RK,
  createBaseMap, paintLine, paintColumn, paintRect, paint,
  carveSideGate, carveVerticalGate, applyOverrides
} from './constants.js';

function createMap2Base() {
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
  paintRect(map2, 18, 26, 7, 7, RK);

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

  return map2;
}

const map2Overrides = [];

export function getMap2() {
  const map2 = createMap2Base();
  applyOverrides(map2, map2Overrides);
  return map2;
}
