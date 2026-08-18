import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

export const CATEGORY_COLORS = {
  'História': { border: '#D97706', badge: 'bg-amber-100 text-amber-800' },
  'História / Patrimônio': { border: '#B45309', badge: 'bg-amber-100 text-amber-800' },
  'História / Cultura Local': { border: '#F59E0B', badge: 'bg-yellow-100 text-yellow-800' },
  'História / Cultura Regional': { border: '#EAB308', badge: 'bg-yellow-100 text-yellow-800' },
  'História / Imagem e Som': { border: '#EA580C', badge: 'bg-orange-100 text-orange-800' },
  'Imagem e Som / História': { border: '#EA580C', badge: 'bg-orange-100 text-orange-800' },
  'História Industrial': { border: '#57534E', badge: 'bg-stone-100 text-stone-800' },
  'História Ferroviária': { border: '#78716C', badge: 'bg-stone-100 text-stone-800' },
  'História / Abolição': { border: '#991B1B', badge: 'bg-red-100 text-red-800' },
  'Memória / Diversidade': { border: '#C026D3', badge: 'bg-fuchsia-100 text-fuchsia-800' },
  'Memória / Patrimônio': { border: '#BE185D', badge: 'bg-pink-100 text-pink-800' },
  'Memória / Patrimônio Histórico': { border: '#9D174D', badge: 'bg-pink-100 text-pink-800' },
  'Memória / História Local': { border: '#E11D48', badge: 'bg-rose-100 text-rose-800' },
  'Memória Comunitária': { border: '#F43F5E', badge: 'bg-rose-100 text-rose-800' },
  'Memória Educacional': { border: '#0284C7', badge: 'bg-sky-100 text-sky-800' },
  'Educação / Memória': { border: '#0369A1', badge: 'bg-sky-100 text-sky-800' },
  'Memória Institucional / Política': { border: '#334155', badge: 'bg-slate-100 text-slate-800' },
  'Memória Institucional / Jurídica': { border: '#475569', badge: 'bg-slate-100 text-slate-800' },
  'Memória Política': { border: '#1E293B', badge: 'bg-slate-100 text-slate-800' },
  'Memória / Direitos Humanos': { border: '#4F46E5', badge: 'bg-indigo-100 text-indigo-800' },
  'Memória / Resistência': { border: '#DC2626', badge: 'bg-red-100 text-red-800' },
  'Memória / Pesca': { border: '#0D9488', badge: 'bg-teal-100 text-teal-800' },
  'Artes': { border: '#7C3AED', badge: 'bg-violet-100 text-violet-800' },
  'Artes / Cultura': { border: '#6D28D9', badge: 'bg-violet-100 text-violet-800' },
  'Arte / Cultura': { border: '#8B5CF6', badge: 'bg-violet-100 text-violet-800' },
  'Cultura / Artes': { border: '#5B21B6', badge: 'bg-violet-100 text-violet-800' },
  'Artes Visuais': { border: '#9333EA', badge: 'bg-purple-100 text-purple-800' },
  'Artes / Fotografia': { border: '#4338CA', badge: 'bg-indigo-100 text-indigo-800' },
  'Artes, Arquitetura e Linguística': { border: '#A21CAF', badge: 'bg-fuchsia-100 text-fuchsia-800' },
  'Arte Popular': { border: '#D946EF', badge: 'bg-fuchsia-100 text-fuchsia-800' },
  'Arte Popular / Artesanato': { border: '#C026D3', badge: 'bg-fuchsia-100 text-fuchsia-800' },
  'Cultura Popular': { border: '#F97316', badge: 'bg-orange-100 text-orange-800' },
  'Cultura Popular / Música': { border: '#F59E0B', badge: 'bg-yellow-100 text-yellow-800' },
  'Cultura Regional': { border: '#FB923C', badge: 'bg-orange-100 text-orange-800' },
  'Cultura Infantil / Brinquedos': { border: '#EC4899', badge: 'bg-pink-100 text-pink-800' },
  'Cultura / Gastronomia': { border: '#EF4444', badge: 'bg-red-100 text-red-800' },
  'Cultura Regional / Gastronomia': { border: '#B91C1C', badge: 'bg-red-100 text-red-800' },
  'Cultura / Lazer': { border: '#14B8A6', badge: 'bg-teal-100 text-teal-800' },
  'Clássico / Tradicional': { border: '#A8A29E', badge: 'bg-stone-100 text-stone-800' },
  'Turismo / Cultura': { border: '#06B6D4', badge: 'bg-cyan-100 text-cyan-800' },
  'Ciências Exatas, da Terra, Biológicas e da Saúde': { border: '#059669', badge: 'bg-emerald-100 text-emerald-800' },
  'Ciências / Educação': { border: '#10B981', badge: 'bg-emerald-100 text-emerald-800' },
  'Ciências / Astronomia': { border: '#1D4ED8', badge: 'bg-blue-100 text-blue-800' },
  'Ecomuseu / Meio Ambiente': { border: '#65A30D', badge: 'bg-lime-100 text-lime-800' },
  'Indígena / Etnologia': { border: '#84CC16', badge: 'bg-lime-100 text-lime-800' },
  'Cultura Indígena / Memória': { border: '#4D7C0F', badge: 'bg-lime-100 text-lime-800' },
  'Antropologia e Arqueologia': { border: '#15803D', badge: 'bg-green-100 text-green-800' },
  'Arqueologia / Patrimônio': { border: '#166534', badge: 'bg-green-100 text-green-800' },
  'Antropologia e Arqueologia / Ecomuseu': { border: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'Gestão / Política Cultural': { border: '#64748B', badge: 'bg-slate-100 text-slate-800' },
  'Não informado': { border: '#94A3B8', badge: 'bg-slate-100 text-slate-600' },
}

export function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Não informado']
}

// Estado global reativo
const allMuseums = ref([])

export function useMuseums() {
  const searchQuery = ref('')
  const activeCategory = ref(null)
  const onlyAccessible = ref(false)

  // 1. BUSCAR DO BANCO DE DADOS
  const fetchMuseums = async () => {
    const { data, error } = await supabase
      .from('museus')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar museus:', error)
      return
    }
    allMuseums.value = data
  }

  // Carrega os museus automaticamente ao abrir a tela
  onMounted(() => {
    if (allMuseums.value.length === 0) fetchMuseums()
  })

  // 2. ATUALIZAR MUSEU EXISTENTE
  const updateMuseum = async (id, museumData) => {
    const { data, error } = await supabase
      .from('museus')
      .update(museumData)
      .eq('id', id)
      .select()

    if (!error && data) {
      const index = allMuseums.value.findIndex(m => m.id === id)
      if (index !== -1) {
        allMuseums.value[index] = data[0]
      }
    }
  }

  // 3. MARCAR COMO REVISADO
  const toggleVerify = async (museum) => {
    if (!museum) return

    const novoStatus = !museum.revisado
    const { data, error } = await supabase
      .from('museus')
      .update({ revisado: novoStatus })
      .eq('id', museum.id)
      .select()

    if (!error && data) {
      const index = allMuseums.value.findIndex(m => m.id === museum.id)
      if (index !== -1) {
        allMuseums.value[index] = data[0]
      }
    }
  }

  // 4. CADASTRAR NOVO MUSEU
  const addMuseum = async (museumData) => {
    const { data, error } = await supabase
      .from('museus')
      .insert([museumData])
      .select()
    
    if (!error && data) {
      allMuseums.value.unshift(data[0]) // Adiciona no topo da lista
    }
  }

  // 5. LÓGICA DE FILTROS E CATEGORIAS
  const allCategories = computed(() => {
    const cats = new Set(allMuseums.value.map((m) => m.categoria))
    return [...cats].sort()
  })

  const filteredMuseums = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    return allMuseums.value.filter((museum) => {
      const matchesQuery = !query || 
        museum.nome?.toLowerCase().includes(query) || 
        museum.cidade?.toLowerCase().includes(query)
      const matchesCategory = !activeCategory.value || museum.categoria === activeCategory.value
      const matchesAccessibility = !onlyAccessible.value || (museum.acessibilidade && museum.acessibilidade !== 'Não informado')

      return matchesQuery && matchesCategory && matchesAccessibility
    })
  })

  // Retorna os IDs dos museus revisados para o Vue pintar de laranja
  const verifiedMuseums = computed(() => {
    return allMuseums.value.filter(m => m.revisado).map(m => m.id)
  })

  function setCategory(category) {
    activeCategory.value = activeCategory.value === category ? null : category
  }

  function clearFilters() {
    searchQuery.value = ''
    activeCategory.value = null
    onlyAccessible.value = false
  }

  return {
    searchQuery,
    activeCategory,
    onlyAccessible,
    allCategories,
    filteredMuseums,
    verifiedMuseums,
    verifiedCount: computed(() => allMuseums.value.filter(m => m.revisado).length),
    totalCount: computed(() => allMuseums.value.length),
    setCategory,
    toggleVerify,
    addMuseum,
    updateMuseum,
    clearFilters,
  }
}