// pokemon-frontend/src/logic/encounter.js
import { getEncounterRate } from "../data/masterTileset";

export function checkEncounter(x, y, map) {
  const tileId = map[y]?.[x];
  const encounterRate = getEncounterRate(tileId);
  
  // Only trigger battles on tiles with encounter rate > 0
  if (encounterRate > 0 && Math.random() < encounterRate) {
    // Determine encounter area based on tile type
    let area = "grass";
    
    // Snow areas (trees-snow tiles: 857-926)
    if (tileId >= 857 && tileId <= 926) {
      area = "snow";
    }
    // Cave areas (rock tiles: 721-856)
    else if (tileId >= 721 && tileId <= 856) {
      area = "cave";
    }
    // Water areas
    else if (tileId >= 15 && tileId <= 19) {
      area = "water";
    }
    
    return { shouldBattle: true, area: area };
  }
  
  return { shouldBattle: false, area: null };
}