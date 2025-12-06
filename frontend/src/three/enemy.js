import * as THREE from "three";
import { TILE_SIZE } from "./grid";

export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.list = [];
  }

  spawn(path) {
    if (!path || path.length === 0) return;

    const geo = new THREE.SphereGeometry(0.3, 16, 16);
    const mat = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(path[0][0] * TILE_SIZE, 0.3, path[0][1] * TILE_SIZE);

    this.scene.add(mesh);

    this.list.push({
      mesh,
      path,
      segment: 0,
      t: 0,
      speed: 2,
      dead: false,
      health: 3
    });
  }

  update(delta) {
    for (let enemy of this.list) {
      if (enemy.dead) {
        this.scene.remove(enemy.mesh);
        continue;
      }

      this.moveEnemy(enemy, delta);
    }

    this.list = this.list.filter(e => !e.dead);
  }

  moveEnemy(e, delta) {
    if (e.segment >= e.path.length - 1) return;

    let [x1, y1] = e.path[e.segment];
    let [x2, y2] = e.path[e.segment + 1];

    const start = new THREE.Vector3(x1*TILE_SIZE, 0.3, y1*TILE_SIZE);
    const end = new THREE.Vector3(x2*TILE_SIZE, 0.3, y2*TILE_SIZE);

    const dist = start.distanceTo(end);
    const step = (e.speed * delta) / dist;

    e.t += step;

    if (e.t >= 1) {
      e.segment++;
      e.t = 0;
      e.mesh.position.copy(end);
    } else {
      e.mesh.position.lerpVectors(start, end, e.t);
    }
  }
}
