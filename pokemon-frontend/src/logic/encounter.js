export function checkEncounter(x, y, map) {
  if (map[y][x] === 2) {
    if (Math.random() < 0.3) {
      return true;
    }
  }
  return false;
}