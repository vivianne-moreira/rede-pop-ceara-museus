<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative">
    <label for="museum-search" class="sr-only">
      Buscar museu por nome ou cidade
    </label>

    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" aria-hidden="true">
      <svg
        class="w-4.5 h-4.5 text-slate-400"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>

    <input
      id="museum-search"
      type="search"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      placeholder="Buscar por nome ou cidade..."
      class="
        w-full pl-10 pr-10 py-2.5
        bg-white border border-slate-200
        rounded-xl text-sm text-slate-800
        placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-700
        transition-all duration-150
      "
      autocomplete="off"
      spellcheck="false"
      aria-label="Buscar museu por nome ou cidade"
      :aria-describedby="modelValue ? 'search-result-count' : undefined"
    />

    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <button
        v-if="modelValue"
        type="button"
        @click="emit('update:modelValue', '')"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Limpar busca"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </Transition>
  </div>

  <div
    id="search-result-count"
    aria-live="polite"
    aria-atomic="true"
    class="mt-1.5 text-xs text-slate-500 pl-1"
  >
    <span v-if="modelValue">
      {{ resultCount }} resultado{{ resultCount !== 1 ? 's' : '' }} encontrado{{ resultCount !== 1 ? 's' : '' }}
    </span>
    <span v-else>
      {{ totalCount }} museus cadastrados
    </span>
  </div>
</template>
