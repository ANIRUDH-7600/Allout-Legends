// pokemon-frontend/src/logic/encounter.js
import { getEncounterRate } from "../data/masterTileset";

export function checkEncounter(x, y, map) {
  const tileId = map[y]?.[x];
  const encounterRate = getEncounterRate(tileId);
  
  // Only trigger battles on tiles with encounter rate > 0
  if (encounterRate > 0 && Math.random() < encounterRate) {
    return { shouldBattle: true, area: "grass" };
  }
  
  return { shouldBattle: false, area: null };
}