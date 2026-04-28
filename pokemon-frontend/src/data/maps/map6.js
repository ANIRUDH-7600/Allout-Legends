// ══════════════════════════════════════════════════════════
//  REALM 6 — mixed route
// ══════════════════════════════════════════════════════════

import {
  G, G2, PTH, TG, TG2, TREE, TR2, TR3, TR4, RK, RK2,
  createBaseMap, paintLine, paintColumn, paintRect, paint,
  carveSideGate, carveVerticalGate, applyOverrides
} from './constants.js';

function createMap6Base() {
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

  return map6;
}

const map6Overrides = [];

export function getMap6() {
  const map6 = createMap6Base();
  applyOverrides(map6, map6Overrides);
  return map6;
}
