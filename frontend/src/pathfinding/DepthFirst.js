export default function DFS(grid, start, goal) {
    const stack = [start];
    const visited = new Set([start]);

    while (stack.length > 0) {
        const current = stack.pop();

        if (current === goal) return reconstruct(current);

        for (const n of grid.neighbors(current)) {
            if (!visited.has(n)) {
                visited.add(n);
                n.parent = current;
                stack.push(n);
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
