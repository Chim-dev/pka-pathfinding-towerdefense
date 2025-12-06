import AStar from "../AStar.js";
import Dijkstra from "../Dijkstra.js";
import GreedyBestFirst from "../GreedyBestFirst.js";
import BFS from "../BreadthFirst.js";
import DFS from "../DepthFirst.js";
import Grid from "../Grid.js";

export default class PathfindingManager {
    constructor(width, height) {
        this.grid = new Grid(width, height);

        this.algorithms = {
            astar: AStar,
            dijkstra: Dijkstra,
            greedy: GreedyBestFirst,
            bfs: BFS,
            dfs: DFS
        };
    }

    setObstacle(x, y, value) {
        this.grid.setObstacle(x, y, value);
    }

    find(algo, start, goal) {
        const fn = this.algorithms[algo];
        if (!fn) return null;

        const s = this.grid.getNode(start.x, start.y);
        const g = this.grid.getNode(goal.x, goal.y);

        // reset all nodes memory
        for (const col of this.grid.nodes) {
            for (const n of col) {
                n.parent = null;
                n.g = 0;
                n.h = 0;
                n.f = 0;
            }
        }

        return fn(this.grid, s, g);
    }
}
