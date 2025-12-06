from typing import List, Tuple
import heapq

Grid = List[List[int]]
Point = Tuple[int, int]

# 0 = walkable, selain itu dianggap blocked (bisa kamu modif untuk weight/jangkauan tower)
WALKABLE = 0

def heuristic(a: Point, b: Point) -> int:
    # Manhattan distance
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def in_bounds(grid: Grid, x: int, y: int) -> bool:
    return 0 <= y < len(grid) and 0 <= x < len(grid[0])

def is_walkable(grid: Grid, x: int, y: int) -> bool:
    return grid[y][x] == WALKABLE

def neighbors(grid: Grid, x: int, y: int) -> List[Point]:
    # 4-neighborhood: up, down, left, right
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    result: List[Point] = []
    for dx, dy in dirs:
        nx, ny = x + dx, y + dy
        if in_bounds(grid, nx, ny) and is_walkable(grid, nx, ny):
            result.append((nx, ny))
    return result

def reconstruct_path(came_from: dict[Point, Point], current: Point) -> List[Point]:
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def compute_path(grid: Grid, start: Point, goal: Point) -> List[Point]:
    # A* search di grid
    open_set: list[Tuple[int, Point]] = []
    heapq.heappush(open_set, (0, start))

    came_from: dict[Point, Point] = {}
    g_score: dict[Point, int] = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            return reconstruct_path(came_from, current)

        cx, cy = current
        for nx, ny in neighbors(grid, cx, cy):
            neighbor = (nx, ny)
            tentative_g = g_score[current] + 1  # cost 1 per langkah

            if tentative_g < g_score.get(neighbor, 1_000_000_000):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score, neighbor))

    # Tidak ada path
    return []
