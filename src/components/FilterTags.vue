<script setup>
import { ref, watch } from 'vue'
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

// Nova variável reativa para controlar se a aba de categorias está aberta ou fechada
const isExpanded = ref(false)

// Fecha a aba automaticamente se o utilizador clicar em "Limpar filtros"
watch(() => props.hasActiveFilters, (newVal) => {
  if (!newVal) isExpanded.value = false
})

// Função para selecionar categoria e fechar a aba automaticamente para poupar espaço
const handleCategorySelect = (category) => {
  emit('select-category', category)
  isExpanded.value = false
}
</script>

<template>
  <div class="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        Filtros
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
          class="text-xs text-red-600 hover:text-red-700 font-bold transition-colors focus:outline-none focus:underline flex items-center gap-1"
          aria-label="Limpar todos os filtros ativos"
        >
          Limpar filtros
        </button>
      </Transition>
    </div>

<!-- Botões Principais Fixos -->
    <div class="flex flex-wrap gap-2 items-center">
      <!-- Botão Acessibilidade -->
      <button
        type="button"
        role="checkbox"
        :aria-checked="onlyAccessible"
        @click="emit('toggle-accessibility')"
        class="
          inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
          border-2 transition-all duration-150 focus:outline-none
        "
        :class="[
          onlyAccessible
            ? 'bg-amber-500 border-amber-500 text-white shadow-sm ring-2 ring-offset-1 ring-amber-500'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
        ]"
      >
        Acessibilidade
        <svg v-if="onlyAccessible" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>

      <!-- Botão Expansor de Categorias -->
      <button
        @click="isExpanded = !isExpanded"
        class="
          inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
          border-2 transition-all duration-150 focus:outline-none
        "
        :class="[
          activeCategory 
            ? 'bg-teal-600 border-teal-600 text-white shadow-sm ring-2 ring-offset-1 ring-teal-600' 
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
        ]"
      >
        <span v-if="activeCategory">Categoria: {{ activeCategory }}</span>
        <span v-else>Selecionar Categoria temática ({{ categories.length }})</span>
        
        <svg 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <!-- Painel Expansível de Categorias -->
    <div v-show="isExpanded" class="pt-3 mt-3 border-t border-slate-100">
      <p class="text-[11px] text-slate-400 mb-2 font-medium">Escolha uma categoria para filtrar os resultados:</p>
      
      <!-- max-h-48 e overflow-y-auto criam uma rolagem interna caso existam muitas tags -->
      <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 pb-2" role="group" aria-label="Filtrar por categoria temática">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          @click="handleCategorySelect(category)"
          :aria-pressed="activeCategory === category"
          class="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
            text-xs font-medium border-2 transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-600
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
            :style="{ backgroundColor: activeCategory === category ? 'rgba(255,255,255,0.9)' : getCategoryStyle(category).border }"
            aria-hidden="true"
          ></span>
          {{ category }}
        </button>
      </div>
    </div>
    
  </div>
</template>