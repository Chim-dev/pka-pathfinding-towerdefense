import * as THREE from "three";

export const TILE_SIZE = 1;

// 0 = jalan
// 1 = wall
// 2 = tower
export let grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

export const GRID_W = grid[0].length;
export const GRID_H = grid.length;

export function isWalkable(x, y) {
  return grid[y] && grid[y][x] === 0;
}

export function addTower(x, y) {
  if (!grid[y] || grid[y][x] !== 0) return false;
  grid[y][x] = 2;
  return true;
}

export function removeTower(x, y) {
  if (grid[y][x] === 2) {
    grid[y][x] = 0;
    return true;
  }
  return false;
}
