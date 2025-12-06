<template>
  <div class="app-root">
    <h1 class="title">Tower Defense 3D Modular</h1>

    <div class="controls">
      <select v-model="algo">
        <option value="astar">A*</option>
        <option value="bfs">BFS</option>
        <option value="dijkstra">Dijkstra</option>
      </select>

      <button @click="spawnEnemy">Spawn Enemy</button>
    </div>

    <div ref="threeContainer" class="three-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Game3D } from "./three/scene";
import { grid } from "./three/grid";

const threeContainer = ref(null);
let game = null;

const algo = ref("astar");

async function requestPath() {
  const payload = {
    grid,
    start: [0,0],
    goal: [9,3],
  };

  const res = await fetch(`http://localhost:8000/path/${algo.value}`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return data.path;
}

function spawnEnemy() {
  game.requestPath();
}

onMounted(() => {
  game = new Game3D(threeContainer.value, requestPath);
});

onBeforeUnmount(() => {
  game.dispose();
});
</script>

<style scoped>
.app-root {
  width: 100vw;
  height: 100vh;
  background: #181a1f;
  color: white;
  overflow: hidden;
}

.title {
  padding: 10px;
  font-size: 18px;
  background: #20232a;
}

.controls {
  display: flex;
  gap: 12px;
  padding: 10px;
}

.three-container {
  width: 100%;
  height: calc(100vh - 120px);
}
</style>
