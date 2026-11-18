<template>
  <main class="wrap">
    <h1>Vue 工程</h1>
    <p class="hint">script setup + TypeScript，经 esbuild 打包。</p>
    <button @click="n++">点过 {{ n }} 次</button>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const n = ref<number>(0);
</script>

<style scoped>
.wrap {
  font-family: system-ui, sans-serif;
  max-width: 480px;
  margin: 0 auto;
  padding: 32px 20px;
  text-align: center;
}
.hint {
  color: #6a737d;
}
button {
  font-size: 17px;
  padding: 10px 22px;
  border: 1px solid #61809b;
  border-radius: 10px;
  background: #eef2f6;
  color: #3a4149;
}
</style>