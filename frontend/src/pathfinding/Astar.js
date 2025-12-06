import PriorityQueue from "./utils/PriorityQueue.js";

export default function AStar(grid, start, goal) {
    const open = new PriorityQueue((a, b) => a.f < b.f);
    const closed = new Set();

    open.push(start);

    while (!open.isEmpty()) {
        const current = open.pop();

        if (current === goal) {
            return reconstructPath(current);
        }

        closed.add(current);

        for (const neigh of grid.neighbors(current)) {
            if (closed.has(neigh)) continue;

            const gScore = current.g + 1;

            if (!open.contains(neigh) || gScore < neigh.g) {
                neigh.g = gScore;
                neigh.h = Math.abs(neigh.x - goal.x) + Math.abs(neigh.y - goal.y);
                neigh.f = neigh.g + neigh.h;

                neigh.parent = current;

                if (!open.contains(neigh)) {
                    open.push(neigh);
                }
            }
        }
    }

    return null;
}

function reconstructPath(node) {
    const path = [];
    let current = node;
    while (current != null) {
        path.push({ x: current.x, y: current.y });
        current = current.parent;
    }
    return path.reverse();
}
