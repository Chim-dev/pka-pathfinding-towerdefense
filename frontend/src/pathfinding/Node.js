export default class Node {
    constructor(x, y, walkable = true) {
        this.x = x;
        this.y = y;
        this.walkable = walkable;

        this.g = 0; // cost so far
        this.h = 0; // heuristic
        this.f = 0; // total cost
        this.parent = null;
    }
}
