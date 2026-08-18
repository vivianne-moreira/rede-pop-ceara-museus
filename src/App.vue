<script setup>
import Header from '@/components/Header.vue'
</script>

<template>
  <a
    href="#main-content"
    class="
      sr-only focus:not-sr-only
      fixed top-4 left-4 z-50
      bg-white text-slate-900 px-4 py-2 rounded-xl shadow-lg
      text-sm font-semibold
      focus:outline-none focus:ring-2 focus:ring-green-600
    "
  >
    Ir para o conteúdo principal
  </a>

  <div class="min-h-screen flex flex-col" style="background-color: #F5F2EC;">
    <Header />
    <RouterView />
  </div>
</template>
