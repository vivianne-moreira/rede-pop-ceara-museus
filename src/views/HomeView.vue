<script setup>
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterTags from '@/components/FilterTags.vue'
import MuseumCard from '@/components/MuseumCard.vue'
import MuseumMap from '@/components/MuseumMap.vue'
import MuseumForm from '@/components/MuseumForm.vue'
import { useMuseums } from '@/composables/useMuseums'

const {
  searchQuery,
  activeCategory,
  onlyAccessible,
  allCategories,
  filteredMuseums,
  verifiedCount,
  totalCount,
  setCategory,
  toggleVerify,
  clearFilters,
  updateMuseum, 
  addMuseum,
} = useMuseums()

const hasActiveFilters = computed(
  () => !!searchQuery.value || !!activeCategory.value || onlyAccessible.value
)

const activeView = ref('list')
const showForm = ref(false)
const selectedMuseum = ref(null)

const isTeamMember = ref(false)
const TEAM_PASSWORD = 'popceara2026'

function checkAccess() {
  if (isTeamMember.value) return true

  const password = window.prompt('Acesso restrito à equipe. Digite a senha:')
  if (password === TEAM_PASSWORD) {
    isTeamMember.value = true
    return true
  }

  if (password !== null) {
    alert('Senha incorreta!')
  }
  return false
}

function toggleAccessibility() {
  onlyAccessible.value = !onlyAccessible.value
}

// Controle do Modal
const openAddForm = () => {
  if (!checkAccess()) return
  selectedMuseum.value = null
  showForm.value = true
}

const openEditForm = (museum) => {
  if (!checkAccess()) return
  selectedMuseum.value = museum
  showForm.value = true
}

const handleToggleVerify = (museum) => {
  if (!checkAccess()) return
  toggleVerify(museum)
}

const closeForm = () => {
  showForm.value = false
  selectedMuseum.value = null
}

const handleSave = async (museumData) => {
  if (selectedMuseum.value) {
    await updateMuseum(selectedMuseum.value.id, museumData)
  } else {
    await addMuseum(museumData)
  }
  closeForm()
}
</script>

<template>
  <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <section aria-labelledby="hero-title" class="space-y-4">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div class="space-y-2">
          <p class="text-xs font-semibold tracking-widest uppercase" style="color: #1A6B5A;">
            Instituto Federal do Ceará · Rede Pop Ciência
          </p>
          <h2 id="hero-title" class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            Museus do Estado<br class="hidden sm:inline" /> do Ceará
          </h2>
          <p class="text-sm text-slate-500 max-w-xl leading-relaxed">
            Mapeamento aberto dos equipamentos culturais da Rede Pop Ceará.
            Contribui com os Objetivos de Desenvolvimento Sustentável
            <strong class="text-slate-700 font-semibold">ODS 10</strong> (Redução das Desigualdades)
            e <strong class="text-slate-700 font-semibold">ODS 11</strong> (Cidades Sustentáveis).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0">
          <div class="text-center px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm min-w-[80px] h-[54px] flex flex-col justify-center">
            <p class="text-xl font-black leading-none" style="color: #0F2A4A;">{{ totalCount }}</p>
            <p class="text-[10px] text-slate-500 mt-1 leading-tight">Cadastrados</p>
          </div>
          <div class="text-center px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm min-w-[80px] h-[54px] flex flex-col justify-center">
            <p class="text-xl font-black leading-none" style="color: #D97706;">{{ verifiedCount }}</p>
            <p class="text-[10px] text-slate-500 mt-1 leading-tight">Verificados</p>
          </div>
          <div class="text-center px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm min-w-[80px] h-[54px] flex flex-col justify-center">
            <p class="text-xl font-black leading-none" style="color: #1A6B5A;">{{ allCategories.length }}</p>
            <p class="text-[10px] text-slate-500 mt-1 leading-tight">Categorias</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4" aria-label="Busca e filtros">
      <div class="flex flex-col md:flex-row md:items-start gap-3">
        <div class="flex-1 min-w-0">
          <SearchBar
            v-model="searchQuery"
            :result-count="filteredMuseums.length"
            :total-count="totalCount"
          />
        </div>

        <div class="flex gap-3">
          <button 
            @click="openAddForm" 
            class="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            Cadastrar Novo
          </button>

          <div class="flex-shrink-0 flex rounded-xl border border-slate-200 overflow-hidden" role="group">
            <button
              type="button"
              @click="activeView = 'list'"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all duration-150"
              :class="activeView === 'list' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'"
            >
              Lista
            </button>
            <button
              type="button"
              @click="activeView = 'map'"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-l border-slate-200 transition-all duration-150"
              :class="activeView === 'map' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'"
            >
              Mapa
            </button>
          </div>
        </div>
      </div>

      <FilterTags
        :categories="allCategories"
        :active-category="activeCategory"
        :only-accessible="onlyAccessible"
        :has-active-filters="hasActiveFilters"
        @select-category="setCategory"
        @toggle-accessibility="toggleAccessibility"
        @clear-filters="clearFilters"
      />
    </section>

    <section v-show="activeView === 'map'" aria-label="Mapa dos museus do Ceará">
      <MuseumMap
        :museums="filteredMuseums"
        height="580px"
      />
    </section>

    <section v-show="activeView === 'list'" aria-label="Lista de museus">
      <Transition mode="out-in">
        <div v-if="filteredMuseums.length === 0" class="text-center py-20 space-y-3">
          <p class="text-slate-600 font-semibold">Nenhum museu encontrado</p>
          <button @click="clearFilters" class="mt-2 inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-700">
            Limpar filtros
          </button>
        </div>

        <!-- Renderiza a lista de cartões puros sem sujeira no template -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MuseumCard
            v-for="museum in filteredMuseums"
            :key="museum.id"
            :museum="museum"
            @edit="openEditForm"
            @verify="handleToggleVerify"
          />
        </div>
      </Transition>
    </section>

    <MuseumForm 
      v-if="showForm" 
      :initial-data="selectedMuseum"
      @close="closeForm"
      @save="handleSave"
    />

    <footer class="border-t border-slate-100 pt-6 pb-2">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <p>Rede Pop Ceará — Mapa de Museus</p>
      </div>
    </footer>
  </main>
</template>