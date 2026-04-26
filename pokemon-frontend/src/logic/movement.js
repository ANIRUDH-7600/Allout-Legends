// pokemon-frontend/src/logic/movement.js

import { isWalkable } from "../data/masterTileset";

export function movePlayer(player, key, map) {
  let newX = player.x;
  let newY = player.y;

  if (key === "ArrowUp") newY--;
  if (key === "ArrowDown") newY++;
  if (key === "ArrowLeft") newX--;
  if (key === "ArrowRight") newX++;

  // Check bounds
  if (newY < 0 || newY >= map.length) return player;
  if (newX < 0 || newX >= map[0].length) return player;
  
  const tileId = map[newY][newX];
  
  // Use dynamic walkability from master tileset
  if (isWalkable(tileId)) {
    return { x: newX, y: newY };
  }

  return player;
}