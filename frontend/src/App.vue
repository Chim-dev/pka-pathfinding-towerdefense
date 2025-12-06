<template>
  <div class="app-root">
    <h1 class="title">Tower Defense 3D + FastAPI</h1>
    <button class="btn" @click="requestPath">
      Request Path from Backend (A*)
    </button>
    <div ref="threeContainer" class="three-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { initThreeScene, disposeThreeScene, grid } from './threeScene';

const threeContainer = ref(null);
let threeInstance = null;

onMounted(() => {
  threeInstance = initThreeScene(threeContainer.value);
});

onBeforeUnmount(() => {
  if (threeInstance) {
    disposeThreeScene(threeInstance);
  }
});

async function requestPath() {
  if (!threeInstance) return;

  const payload = {
    grid,          // kirim grid yang sama dengan yang dipakai Three.js
    start: [0, 0], // bisa kamu ganti
    goal: [9, 3],  // bisa kamu ganti
  };

  try {
    const res = await fetch('http://localhost:8000/path/astar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json(); // { path: [[x,y], ...] }
    threeInstance.setPath(data.path);
  } catch (err) {
    console.error('Failed to fetch path:', err);
  }
}
</script>

<style scoped>
.app-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #181a1f;
  color: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

.title {
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 600;
  background: #20232a;
  border-bottom: 1px solid #2b2f3a;
}

.btn {
  margin: 8px 16px;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background: #4c8cff;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover {
  background: #3c76dd;
}

.three-container {
  flex: 1;
}
</style>
