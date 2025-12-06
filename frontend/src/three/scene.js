import * as THREE from "three";
import { GRID_W, GRID_H, TILE_SIZE, grid } from "./grid";
import { EnemyManager } from "./enemy";
import { TowerManager } from "./tower";
import { InputManager } from "./input";

export class Game3D {
  constructor(container, pathRequester) {
    this.container = container;
    this.pathRequester = pathRequester;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x20232a);

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
    this.camera.position.set(8, 14, 14);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.controls = this.initControls();
    this.addLights();

    this.buildGrid();

    this.enemies = new EnemyManager(this.scene);
    this.towers = new TowerManager(this.scene, this.enemies);

    this.input = new InputManager(
      container,
      this.camera,
      this.scene,
      this.towers,
      () => this.requestPath()
    );

    this.last = performance.now();
    this.running = true;
    this.loop();
  }

  initControls() {
    return new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  addLights() {
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(10,20,10);
    this.scene.add(dir);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  }

  buildGrid() {
    const floorMat = new THREE.MeshPhongMaterial({ color: 0x3b3f4a });
    const wallMat  = new THREE.MeshPhongMaterial({ color: 0x4444ff });
    const towerMat = new THREE.MeshPhongMaterial({ color: 0xff4444 });

    const floorGeo = new THREE.BoxGeometry(TILE_SIZE, 0.1, TILE_SIZE);
    const wallGeo  = new THREE.BoxGeometry(TILE_SIZE, 1, TILE_SIZE);

    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const fx = x*TILE_SIZE;
        const fz = y*TILE_SIZE;

        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.set(fx, -0.05, fz);
        this.scene.add(floor);

        if (grid[y][x] === 1) {
          const wall = new THREE.Mesh(wallGeo, wallMat);
          wall.position.set(fx, 0.5, fz);
          this.scene.add(wall);
        }
      }
    }
  }

  async requestPath() {
    const path = await this.pathRequester();
    if (path) this.enemies.spawn(path);
  }

  loop() {
    if (!this.running) return;

    requestAnimationFrame(() => this.loop());

    const now = performance.now();
    const delta = (now - this.last) / 1000;
    this.last = now;

    this.enemies.update(delta);
    this.towers.update(delta);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.running = false;
    this.renderer.dispose();
  }
}
