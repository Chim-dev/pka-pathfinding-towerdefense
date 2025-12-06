import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Biar bisa muter leluasa (hati-hati, bisa kebalik)
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;
controls.enableZoom = true;

// Buka range rotasi vertikal (opsional, kalau mau bisa hampir 360 derajat)
controls.minPolarAngle = 0.01;
controls.maxPolarAngle = Math.PI - 0.01;

const GRID_W = grid[0].length;
const GRID_H = grid.length;

const TILE_SIZE = 1;

// Grid contoh; nanti bisa disinkronkan dengan backend
export const grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

export function initThreeScene(container) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x20232a);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(8, 14, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set((GRID_W * TILE_SIZE) / 2, 0, (GRID_H * TILE_SIZE) / 2);
  controls.update();

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight, new THREE.AmbientLight(0xffffff, 0.4));

  buildGrid(scene);

  const enemy = createEnemy();
  scene.add(enemy);

  // ------- state path dinamis -------
  let path = [];           // [[x,y], ...] dari backend
  let segmentIndex = 0;
  let t = 0;
  const speed = 2;

  function resetPath(newPath) {
    path = newPath || [];
    segmentIndex = 0;
    t = 0;
    if (path.length > 0) {
      const [sx, sy] = path[0];
      enemy.position.set(sx * TILE_SIZE, 0.3, sy * TILE_SIZE);
    }
  }

  function updateEnemy(delta) {
    if (!path || path.length < 2) return;
    if (segmentIndex >= path.length - 1) return;

    const [x1, y1] = path[segmentIndex];
    const [x2, y2] = path[segmentIndex + 1];

    const start = new THREE.Vector3(x1 * TILE_SIZE, 0.3, y1 * TILE_SIZE);
    const end   = new THREE.Vector3(x2 * TILE_SIZE, 0.3, y2 * TILE_SIZE);

    const dist = start.distanceTo(end);
    if (dist === 0) {
      segmentIndex++;
      t = 0;
      return;
    }

    const step = (speed * delta) / dist;
    t += step;

    if (t >= 1) {
      t = 0;
      segmentIndex++;
      enemy.position.copy(end);
    } else {
      enemy.position.lerpVectors(start, end, t);
    }
  }

  let lastTime = performance.now();
  let stopped = false;

  function animate(now) {
    if (stopped) return;
    requestAnimationFrame(animate);

    const delta = (now - lastTime) / 1000;
    lastTime = now;

    updateEnemy(delta);
    renderer.render(scene, camera);
  }
  animate(performance.now());

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // API yang diekspos ke Vue
  return {
    scene,
    camera,
    renderer,
    controls,
    enemy,
    setPath: resetPath,
    stop() {
      stopped = true;
      window.removeEventListener('resize', onResize);
    }
  };
}

export function disposeThreeScene(instance) {
  instance.stop();
  instance.renderer.dispose();
}

function buildGrid(scene) {
  const floorMat = new THREE.MeshPhongMaterial({ color: 0x3b3f4a });
  const wallMat  = new THREE.MeshPhongMaterial({ color: 0x4444ff });
  const towerMat = new THREE.MeshPhongMaterial({ color: 0xff4444 });

  const floorGeo = new THREE.BoxGeometry(TILE_SIZE, 0.1, TILE_SIZE);
  const wallGeo  = new THREE.BoxGeometry(TILE_SIZE, 1, TILE_SIZE);
  const towerGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16);

  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const worldX = x * TILE_SIZE;
      const worldZ = y * TILE_SIZE;

      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.set(worldX, -0.05, worldZ);
      scene.add(floor);

      const cell = grid[y][x];
      if (cell === 1) {
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(worldX, 0.5, worldZ);
        scene.add(wall);
      } else if (cell === 2) {
        const tower = new THREE.Mesh(towerGeo, towerMat);
        tower.position.set(worldX, 0.6, worldZ);
        scene.add(tower);
      }
    }
  }
}

function createEnemy() {
  const geo = new THREE.SphereGeometry(0.3, 16, 16);
  const mat = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}
