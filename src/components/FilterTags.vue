<script setup>
import { getCategoryStyle } from '@/composables/useMuseums'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    default: null,
  },
  onlyAccessible: {
    type: Boolean,
    default: false,
  },
  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-category', 'toggle-accessibility', 'clear-filters'])
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Filtrar por
      </span>
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        leave-active-class="transition-all duration-200"
        leave-to-class="opacity-0 scale-95"
      >
        <button
          v-if="hasActiveFilters"
          @click="emit('clear-filters')"
          class="text-xs text-red-600 hover:text-red-700 font-medium transition-colors focus:outline-none focus:underline"
          aria-label="Limpar todos os filtros ativos"
        >
          Limpar filtros
        </button>
      </Transition>
    </div>

    <div>
      <button
        type="button"
        role="checkbox"
        :aria-checked="onlyAccessible"
        @click="emit('toggle-accessibility')"
        class="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
          border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500
        "
        :class="[
          onlyAccessible
            ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
            : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
        ]"
      >
        Acessibilidade confirmada
        <svg
          v-if="onlyAccessible"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>

    <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria temática">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        @click="emit('select-category', category)"
        :aria-pressed="activeCategory === category"
        class="
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
          text-xs font-medium border-2 transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-600
        "
        :class="[
          activeCategory === category
            ? 'text-white shadow-sm'
            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
        ]"
        :style="activeCategory === category
          ? { backgroundColor: getCategoryStyle(category).border, borderColor: getCategoryStyle(category).border }
          : {}"
      >
        <span
          class="w-1.5 h-1.5 rounded-full flex-shrink-0"
          :style="{ backgroundColor: activeCategory === category ? 'rgba(255,255,255,0.7)' : getCategoryStyle(category).border }"
          aria-hidden="true"
        ></span>
        {{ category }}
      </button>
    </div>
  </div>
</template>
