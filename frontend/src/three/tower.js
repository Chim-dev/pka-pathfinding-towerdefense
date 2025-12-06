import * as THREE from "three";
import { TILE_SIZE } from "./grid";

export class TowerManager {
  constructor(scene, enemies) {
    this.scene = scene;
    this.enemies = enemies;
    this.towers = [];
  }

  addTower(x, y) {
    const geometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xff4444 });
    const tower = new THREE.Mesh(geometry, material);
    tower.position.set(x * TILE_SIZE, 0.6, y * TILE_SIZE);

    this.scene.add(tower);
    this.towers.push({ x, y, mesh: tower, cooldown: 0 });
  }

  removeTower(x, y) {
    const index = this.towers.findIndex(t => t.x === x && t.y === y);
    if (index >= 0) {
      this.scene.remove(this.towers[index].mesh);
      this.towers.splice(index, 1);
    }
  }

  update(delta) {
    for (let tower of this.towers) {
      tower.cooldown -= delta;
      if (tower.cooldown > 0) continue;

      const target = this.findTarget(tower);
      if (target) {
        this.shoot(tower, target);
        tower.cooldown = 1.0; // 1 detik cooldown
      }
    }
  }

  findTarget(tower) {
    for (let enemy of this.enemies.list) {
      const dx = enemy.mesh.position.x - tower.x * TILE_SIZE;
      const dz = enemy.mesh.position.z - tower.y * TILE_SIZE;
      const dist = Math.sqrt(dx*dx + dz*dz);

      if (dist < 3.5) return enemy;
    }
    return null;
  }

  shoot(tower, enemy) {
    enemy.health -= 1;
    if (enemy.health <= 0) enemy.dead = true;
  }
}
