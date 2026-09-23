<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <h1>Vue + Vite + Turborepo</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
    </div>
    <p>
      Edit <code>src/App.vue</code> to test HMR
    </p>
  </div>
</template>

<style scoped>
.card {
  padding: 2em;
}
</style>
