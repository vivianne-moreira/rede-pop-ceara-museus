<script setup>
import { computed } from 'vue'
import { getCategoryStyle } from '@/composables/useMuseums'

const props = defineProps({
  museum: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'verify'])

const categoryStyle = computed(() => getCategoryStyle(props.museum.categoria))

const hasAccessibility = computed(() =>
  props.museum.acessibilidade &&
  props.museum.acessibilidade !== 'Não informado'
)

const displayPhone = computed(() => {
  const raw = props.museum.telefone
  if (!raw || raw === 'Não informado') return null
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return raw
})
</script>

<template>
  <article
    class="
      rounded-2xl border shadow-sm
      hover:shadow-md hover:-translate-y-0.5
      transition-all duration-200 overflow-hidden
      flex flex-col
      focus-within:ring-2 focus-within:ring-green-600/40
    "
    :class="museum.revisado ? 'border-amber-300 bg-amber-50/10' : 'border-slate-100 bg-white'"
    :aria-label="`Museu: ${museum.nome}, ${museum.cidade}`"
  >
    <div
      class="h-1 w-full flex-shrink-0"
      :style="{ backgroundColor: categoryStyle.border }"
      aria-hidden="true"
    ></div>

    <div class="p-4 sm:p-5 flex flex-col flex-1 gap-3">
      <div class="flex items-start justify-between gap-2">
        <span
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
          :class="categoryStyle.badge"
        >
          <span
            class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :style="{ backgroundColor: categoryStyle.border }"
            aria-hidden="true"
          ></span>
          {{ museum.categoria }}
        </span>

        <span
          v-if="hasAccessibility"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0"
          :title="museum.acessibilidade"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M19 13v-2c0-1.1-.9-2-2-2h-3l-2-4H8.5c-.83 0-1.5.67-1.5 1.5v.5L9 10.5V13H6v2h3v5h2v-5h3v-2h-3v-2.5l-1.5-3H14l2 4h3v2l-2.5 7H19l2.5-7z"/>
          </svg>
          <span class="sr-only">Acessível — </span>Acessível
        </span>
      </div>

      <div>
        <h2 class="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
          {{ museum.nome }}
        </h2>
        <p class="mt-1 text-xs text-slate-500 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {{ museum.cidade }}, CE
        </p>
      </div>

      <div class="space-y-1 text-xs text-slate-500 flex-1">
        <p v-if="displayPhone" class="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <a :href="`tel:${museum.telefone}`" class="hover:text-slate-700 hover:underline transition-colors">
            {{ displayPhone }}
          </a>
        </p>

        <p v-if="museum.email" class="flex items-center gap-1.5 min-w-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <a :href="`mailto:${museum.email}`" class="truncate hover:text-slate-700 hover:underline transition-colors">
            {{ museum.email }}
          </a>
        </p>

        <p v-if="hasAccessibility" class="flex items-start gap-1.5 pt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8A020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0 mt-0.5">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <span class="text-amber-700 leading-tight">{{ museum.acessibilidade }}</span>
        </p>
      </div>

      <div class="flex items-center gap-2 pt-1 border-t border-slate-50 flex-wrap">
        <a
          :href="museum.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-600 active:scale-95"
          style="background-color: #1A6B5A;"
          :class="{ 'opacity-50 pointer-events-none': !museum.mapsUrl }"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          Ver no Mapa
        </a>

        <a
          v-if="museum.site"
          :href="museum.site"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-150 active:scale-95"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Site
        </a>
      </div>

      <div class="flex items-center gap-2 pt-3 mt-1 border-t border-slate-100 flex-wrap">
        <button
          @click="$emit('edit', museum)"
          class="flex-1 py-2 px-3 rounded-xl text-[11px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
        >
          Editar Info
        </button>
        
        <button
          @click="$emit('verify', museum)"
          class="flex-1 py-2 px-3 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1"
          :class="museum.revisado ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
        >
          <svg v-if="!museum.revisado" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          {{ museum.revisado ? 'Revisado ✓' : 'Marcar Revisado' }}
        </button>
      </div>

    </div>
  </article>
</template>