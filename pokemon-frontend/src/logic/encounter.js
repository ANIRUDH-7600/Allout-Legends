// pokemon-frontend/src/logic/encounter.js

import { getEncounterRate } from "../data/masterTileset";

export function checkEncounter(x, y, map) {
  const tileId = map[y][x];
  const encounterRate = getEncounterRate(tileId);
  
  if (encounterRate > 0) {
    return Math.random() < encounterRate;
  }
  
  return false;
}