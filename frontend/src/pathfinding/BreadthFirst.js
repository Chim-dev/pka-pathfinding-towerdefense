export default function BFS(grid, start, goal) {
    const queue = [start];
    const visited = new Set([start]);

    while (queue.length > 0) {
        const current = queue.shift();

        if (current === goal) {
            return reconstruct(current);
        }

        for (const n of grid.neighbors(current)) {
            if (!visited.has(n)) {
                visited.add(n);
                n.parent = current;
                queue.push(n);
            }
        }
    }
    return null;
}

function reconstruct(n) {
    const p = [];
    while (n) {
        p.push({ x: n.x, y: n.y });
        n = n.parent;
    }
    return p.reverse();
}
