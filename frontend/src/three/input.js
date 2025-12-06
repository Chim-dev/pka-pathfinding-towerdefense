import { addTower, removeTower } from "./grid";

export class InputManager {
  constructor(container, camera, scene, towerManager, pathCallback) {
    this.container = container;
    this.camera = camera;
    this.scene = scene;
    this.towerManager = towerManager;
    this.pathCallback = pathCallback;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    container.addEventListener("mousedown", e => this.onMouse(e));
  }

  onMouse(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
    const hit = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, hit);

    const x = Math.floor(hit.x);
    const y = Math.floor(hit.z);

    if (e.button === 0) {
      // left click
      if (addTower(x, y)) {
        this.towerManager.addTower(x, y);
        this.pathCallback();     // hitung ulang path musuh
      }
    } else if (e.button === 2) {
      // right click
      if (removeTower(x, y)) {
        this.towerManager.removeTower(x, y);
        this.pathCallback();
      }
    }
  }
}
