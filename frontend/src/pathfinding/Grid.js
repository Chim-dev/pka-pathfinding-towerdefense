import Node from "..pathfinding/Node.js";

export default class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.nodes = [];

        for (let x = 0; x < width; x++) {
            this.nodes[x] = [];
            for (let y = 0; y < height; y++) {
                this.nodes[x][y] = new Node(x, y, true);
            }
        }
    }

    setObstacle(x, y, v) {
        this.nodes[x][y].walkable = !v;
    }

    getNode(x, y) {
        return this.nodes[x][y];
    }

    neighbors(node) {
        const dirs = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1]
        ];

        const result = [];
        for (const [dx, dy] of dirs) {
            const nx = node.x + dx;
            const ny = node.y + dy;
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                if (this.nodes[nx][ny].walkable) {
                    result.push(this.nodes[nx][ny]);
                }
            }
        }
        return result;
    }
}
