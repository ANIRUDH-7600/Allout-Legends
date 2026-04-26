export function movePlayer(player, key, map) {
  const BLOCKED = new Set([
  // Water (rows 0-3, cols 6-14 roughly)
  6,7,8,9,10,11,12,13,14,
  21,22,23,24,25,26,27,28,29,
  36,37,38,39,40,41,42,43,44,
  // Cliff walls
  30,31,32,33,34,35,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,
  // Trees
  75,76,77,78,79,80,81,82,83,84,
  // Rocks/stumps
  96,97,98,99,100,101,102,103,104,
]);

  let newX = player.x;
  let newY = player.y;

  if (key === "ArrowUp") newY--;
  if (key === "ArrowDown") newY++;
  if (key === "ArrowLeft") newX--;
  if (key === "ArrowRight") newX++;

  if (map[newY] && map[newY][newX] !== undefined && !BLOCKED.has(map[newY][newX])) {
    return { x: newX, y: newY };
  }

  return player;
}