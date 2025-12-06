import PriorityQueue from "./utils/PriorityQueue.js";

export default function Dijkstra(grid, start, goal) {
    const open = new PriorityQueue((a, b) => a.g < b.g);
    const visited = new Set();

    open.push(start);

    while (!open.isEmpty()) {
        const current = open.pop();

        if (current === goal) return reconstruct(current);

        visited.add(current);

        for (const n of grid.neighbors(current)) {
            if (visited.has(n)) continue;

            const newCost = current.g + 1;
            if (newCost < n.g || !open.contains(n)) {
                n.g = newCost;
                n.parent = current;

                if (!open.contains(n)) open.push(n);
            }
        }
    }

    return null;
}

function reconstruct(node) {
    const path = [];
    let c = node;
    while (c) {
        path.push({ x: c.x, y: c.y });
        c = c.parent;
    }
    return path.reverse();
}
