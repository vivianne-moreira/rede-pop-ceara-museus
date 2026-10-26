import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

export const CATEGORY_COLORS = {
  'Artes Visuais': { border: '#7C3AED', badge: 'bg-violet-100 text-violet-900' },
  'Artes e Cultura': { border: '#8B5CF6', badge: 'bg-purple-100 text-purple-900' },
  'Arte Popular e Artesanato': { border: '#A855F7', badge: 'bg-fuchsia-100 text-fuchsia-900' },
  'Fotografia e Imagem': { border: '#6366F1', badge: 'bg-indigo-100 text-indigo-900' },

  'História': { border: '#D97706', badge: 'bg-amber-100 text-amber-900' },
  'Patrimônio Histórico': { border: '#EA580C', badge: 'bg-orange-100 text-orange-950' },
  'História Local e Regional': { border: '#F97316', badge: 'bg-orange-100 text-orange-900' },
  'Arqueologia e Antropologia': { border: '#0D9488', badge: 'bg-teal-100 text-teal-900' }, // Turquesa mineral no lugar do marrom
  'História Ferroviária e Industrial': { border: '#0284C7', badge: 'bg-sky-100 text-sky-900' }, // Azul celeste no lugar do cinza/stone
  'História e Abolição': { border: '#BE123C', badge: 'bg-rose-100 text-rose-950' }, // Carmesim vivo no lugar do vinho escuro

  'Cultura Popular': { border: '#FB923C', badge: 'bg-orange-100 text-orange-900' },
  'Cultura e Tradição Regional': { border: '#F59E0B', badge: 'bg-amber-100 text-amber-900' },
  'Cultura Infantil e Brinquedos': { border: '#EC4899', badge: 'bg-pink-100 text-pink-900' },
  'Gastronomia Tradicional': { border: '#E11D48', badge: 'bg-rose-100 text-rose-900' },

  'Ciências e Tecnologia': { border: '#06B6D4', badge: 'bg-cyan-100 text-cyan-900' }, // Ciano brilhante
  'Astronomia e Espaço': { border: '#2563EB', badge: 'bg-blue-100 text-blue-900' }, // Azul royal
  'Ecomuseu e Meio Ambiente': { border: '#10B981', badge: 'bg-emerald-100 text-emerald-900' }, // Verde esmeralda vivo
  'Povos Indígenas e Etnologia': { border: '#84CC16', badge: 'bg-lime-100 text-lime-950' }, // Verde oliva/lime vivo

  'Memória e Direitos Humanos': { border: '#4F46E5', badge: 'bg-indigo-100 text-indigo-950' },
  'Memória Institucional e Política': { border: '#0E7490', badge: 'bg-cyan-100 text-cyan-950' }, // Ciano escuro/petróleo no lugar do grafite

  'Não informado': { border: '#93C5FD', badge: 'bg-blue-50 text-blue-800' }, // Azul pastel em vez de cinza/ardósia
}

// Normalizador refinado para mapear categorias do banco para os 21 termos oficiais
export function normalizeCategory(cat) {
  if (!cat || cat === 'Não informado') return 'Não informado'
  const text = cat.toLowerCase()

  // 1. Povos Indígenas
  if (text.includes('indígena') || text.includes('etnologia')) {
    return 'Povos Indígenas e Etnologia'
  }

  // 2. Ciências e Astronomia
  if (text.includes('astronomia')) return 'Astronomia e Espaço'
  if (text.includes('ciência') || text.includes('biológica') || text.includes('exatas') || text.includes('terra')) {
    return 'Ciências e Tecnologia'
  }

  // 3. Meio Ambiente
  if (text.includes('eco') || text.includes('ambiente') || text.includes('pesca')) {
    return 'Ecomuseu e Meio Ambiente'
  }

  // 4. Artes e Subdivisões
  if (text.includes('fotografia') || text.includes('imagem e som') || text.includes('audiovisual')) {
    return 'Fotografia e Imagem'
  }
  if (text.includes('artesanato') || text.includes('arte popular')) {
    return 'Arte Popular e Artesanato'
  }
  if (text.includes('artes visuais') || text.includes('arquitetura')) {
    return 'Artes Visuais'
  }
  if (text.includes('arte') || text.includes('artes')) {
    return 'Artes e Cultura'
  }

  // 5. Cultura Popular e Subdivisões
  if (text.includes('brinquedo') || text.includes('infantil')) {
    return 'Cultura Infantil e Brinquedos'
  }
  if (text.includes('gastronomia')) {
    return 'Gastronomia Tradicional'
  }
  if (text.includes('cultura regional') || text.includes('tradição') || text.includes('música')) {
    return 'Cultura e Tradição Regional'
  }
  if (text.includes('cultura popular') || text.includes('lazer')) {
    return 'Cultura Popular'
  }

  // 6. História e Subdivisões
  if (text.includes('abolição')) {
    return 'História e Abolição'
  }
  if (text.includes('ferroviária') || text.includes('ferrovia') || text.includes('industrial')) {
    return 'História Ferroviária e Industrial'
  }
  if (text.includes('arqueologia') || text.includes('antropologia')) {
    return 'Arqueologia e Antropologia'
  }
  if (text.includes('história local') || text.includes('cultura local') || text.includes('memória local') || text.includes('comunitária')) {
    return 'História Local e Regional'
  }
  if (text.includes('patrimônio')) {
    return 'Patrimônio Histórico'
  }

  // 7. Memória e Sociedade
  if (text.includes('direitos humanos') || text.includes('resistência') || text.includes('diversidade')) {
    return 'Memória e Direitos Humanos'
  }
  if (text.includes('institucional') || text.includes('política') || text.includes('jurídica') || text.includes('educacional') || text.includes('educação')) {
    return 'Memória Institucional e Política'
  }
  if (text.includes('história')) {
    return 'História'
  }

  return 'Não informado'
}

export function getCategoryStyle(category) {
  const normalized = normalizeCategory(category)
  return CATEGORY_COLORS[normalized] ?? CATEGORY_COLORS['Não informado']
}

const allMuseums = ref([])

export function useMuseums() {
  const searchQuery = ref('')
  const activeCategory = ref(null)
  const onlyAccessible = ref(false)
  const reviewFilter = ref('all')

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

  onMounted(() => {
    if (allMuseums.value.length === 0) fetchMuseums()
  })

  const updateMuseum = async (id, museumData) => {
    try {
      const payload = { ...museumData }

      payload.maps_url = payload.maps_url || payload.mapsUrl || payload.link_google_maps || ''
      delete payload.mapsUrl
      delete payload.link_google_maps
      delete payload.id

      if (payload.lat === null || payload.lat === '') delete payload.lat
      if (payload.lng === null || payload.lng === '') delete payload.lng

      const { data, error } = await supabase
        .from('museus')
        .update(payload)
        .eq('id', id)
        .select()

      if (error) {
        alert(`Erro Supabase: ${error.message}`)
        throw error
      }

      if (data && data[0]) {
        const index = allMuseums.value.findIndex(m => m.id === id)
        if (index !== -1) {
          allMuseums.value[index] = { ...data[0] }
        }
        alert('Equipamento atualizado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao atualizar museu:', error)
    }
  }

  const toggleVerify = async (museum) => {
    if (!museum) return

    const novoStatus = !museum.revisado
    const { data, error } = await supabase
      .from('museus')
      .update({ revisado: novoStatus })
      .eq('id', museum.id)
      .select()

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    if (data && data[0]) {
      const index = allMuseums.value.findIndex(m => m.id === museum.id)
      if (index !== -1) {
        allMuseums.value[index] = data[0]
      }
    }
  }

  const addMuseum = async (museumData) => {
    try {
      const payload = { ...museumData }
      
      payload.maps_url = payload.maps_url || payload.mapsUrl || payload.link_google_maps || ''
      delete payload.mapsUrl
      delete payload.link_google_maps
      delete payload.id

      if (payload.lat === null || payload.lat === '') delete payload.lat
      if (payload.lng === null || payload.lng === '') delete payload.lng
      
      payload.revisado = false

      const { data, error } = await supabase
        .from('museus')
        .insert([payload])
        .select()
      
      if (error) {
        alert(`Erro do Supabase: ${error.message}`)
        throw error
      }

      if (data && data[0]) {
        allMuseums.value.unshift(data[0])
        alert('Museu cadastrado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao cadastrar museu:', error)
    }
  }

  // Lista com as 20 categorias ativas (excluindo apenas "Não informado" dos botões de filtro)
  const allCategories = computed(() => {
    return Object.keys(CATEGORY_COLORS).filter(c => c !== 'Não informado')
  })

  const filteredMuseums = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    return allMuseums.value.filter((museum) => {
      const matchesQuery = !query || 
        museum.nome?.toLowerCase().includes(query) || 
        museum.cidade?.toLowerCase().includes(query)

      const matchesCategory = !activeCategory.value || 
        normalizeCategory(museum.categoria) === activeCategory.value

      const matchesAccessibility = !onlyAccessible.value || 
        (museum.acessibilidade && museum.acessibilidade !== 'Não informado')

      const isRevisado = Boolean(museum.revisado)
      let matchesReview = true
      if (reviewFilter.value === 'verified') {
        matchesReview = isRevisado
      } else if (reviewFilter.value === 'unverified') {
        matchesReview = !isRevisado
      }

      return matchesQuery && matchesCategory && matchesAccessibility && matchesReview
    })
  })

  const verifiedMuseums = computed(() => {
    return allMuseums.value.filter(m => m.revisado).map(m => m.id)
  })

  function setCategory(category) {
    activeCategory.value = activeCategory.value === category ? null : category
  }

  function setReviewFilter(status) {
    reviewFilter.value = status
  }

  function clearFilters() {
    searchQuery.value = ''
    activeCategory.value = null
    onlyAccessible.value = false
    reviewFilter.value = 'all'
  }

  return {
    searchQuery,
    activeCategory,
    onlyAccessible,
    reviewFilter,
    allCategories,
    filteredMuseums,
    verifiedMuseums,
    verifiedCount: computed(() => allMuseums.value.filter(m => m.revisado).length),
    totalCount: computed(() => allMuseums.value.length),
    setCategory,
    setReviewFilter,
    toggleVerify,
    addMuseum,
    updateMuseum,
    clearFilters,
  }
}