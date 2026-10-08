<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Ajuste o caminho de importação do seu cliente Supabase conforme a sua estrutura de pastas
import { supabase } from '@/supabase' 

const route = useRoute()
const router = useRouter()
const museum = ref(null)
const loading = ref(true)

// Busca os dados do museu no Supabase assim que a página carrega
onMounted(async () => {
  const { id } = route.params
  
  try {
    const { data, error } = await supabase
      .from('museus')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    museum.value = data
  } catch (error) {
    console.error('Erro ao carregar dados do museu:', error)
  } finally {
    loading.value = false
  }
})

// Função para formatar o telefone dinamicamente
const displayPhone = computed(() => {
  if (!museum.value?.telefone || museum.value.telefone === 'Não informado') return null
  const digits = museum.value.telefone.replace(/\D/g, '')
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return museum.value.telefone
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
    <div class="max-w-3xl mx-auto">
      
      <!-- Botão Voltar -->
      <button 
        @click="router.push('/')" 
        class="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 font-medium mb-6 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Voltar para o Mapa
      </button>

      <!-- Estado de Carregamento -->
      <div v-if="loading" class="animate-pulse flex flex-col gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="h-6 bg-slate-200 rounded w-1/4"></div>
        <div class="h-8 bg-slate-200 rounded w-3/4 mt-2"></div>
        <div class="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>

      <!-- Conteúdo do Museu -->
      <article v-else-if="museum" class="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
        
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wide">
            {{ museum.categoria }}
          </span>
          <span v-if="museum.acessibilidade && museum.acessibilidade !== 'Não informado'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            ♿ Acessível
          </span>
        </div>

        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 mt-4 leading-tight">
          {{ museum.nome }}
        </h1>
        
        <p class="text-slate-500 mt-2 text-sm md:text-base flex items-center gap-1.5 font-medium">
          📍 {{ museum.cidade }}, CE
        </p>

        <div class="mt-8 space-y-4 text-sm md:text-base text-slate-600">
          <div v-if="museum.endereco" class="flex gap-3">
            <span class="font-bold text-slate-800 min-w-[80px]">Endereço:</span>
            <span>{{ museum.endereco }}</span>
          </div>

          <div v-if="displayPhone" class="flex gap-3 items-center">
            <span class="font-bold text-slate-800 min-w-[80px]">Telefone:</span>
            <a :href="`tel:${museum.telefone}`" class="text-teal-700 hover:underline">{{ displayPhone }}</a>
          </div>

          <div v-if="museum.email" class="flex gap-3 items-center">
            <span class="font-bold text-slate-800 min-w-[80px]">E-mail:</span>
            <a :href="`mailto:${museum.email}`" class="text-teal-700 hover:underline break-all">{{ museum.email }}</a>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="mt-10 flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-6">
          <a v-if="museum.maps_url" :href="museum.maps_url" target="_blank" rel="noopener noreferrer" class="flex-1 flex justify-center items-center gap-2 bg-teal-700 text-white py-3 px-4 rounded-xl font-bold hover:bg-teal-800 transition-colors active:scale-95">
            Abrir no Google Maps
          </a>
          <a v-if="museum.site" :href="museum.site" target="_blank" rel="noopener noreferrer" class="flex-1 flex justify-center items-center gap-2 bg-white text-slate-700 border-2 border-slate-200 py-3 px-4 rounded-xl font-bold hover:bg-slate-50 transition-colors active:scale-95">
            Acessar Site Oficial
          </a>
        </div>

      </article>

      <div v-else class="text-center text-slate-500 py-10 bg-white rounded-2xl border border-slate-100">
        <p class="text-lg font-bold text-slate-700">Museu não encontrado.</p>
        <p class="mt-2 text-sm">Verifique se o código escaneado está correto.</p>
      </div>

    </div>
  </main>
</template>