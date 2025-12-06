import PriorityQueue from "./utils/PriorityQueue.js";

export default function GreedyBestFirst(grid, start, goal) {
    const open = new PriorityQueue((a, b) => a.h < b.h);
    const visited = new Set();

    start.h = heuristic(start, goal);
    open.push(start);

    while (!open.isEmpty()) {
        const current = open.pop();

        if (current === goal) {
            return reconstruct(current);
        }

        visited.add(current);

        for (const n of grid.neighbors(current)) {
            if (visited.has(n)) continue;

            n.h = heuristic(n, goal);
            n.parent = current;

            if (!open.contains(n)) open.push(n);
        }
    }

    return null;
}

const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

function reconstruct(n) {
    const p = [];
    while (n) {
        p.push({ x: n.x, y: n.y });
        n = n.parent;
    }
    return p.reverse();
}
