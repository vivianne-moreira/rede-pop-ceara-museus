<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { getCategoryStyle } from '@/composables/useMuseums'

const props = defineProps({
  museums: {
    type: Array,
    required: true,
  },
  height: {
    type: String,
    default: '520px',
  },
})

const emit = defineEmits(['museum-click'])

const mapContainer = ref(null)    
let mapInstance = null            
let markersLayer = null           
let resizeObserver = null

const CEARA_CENTER = [-5.4984, -39.3206]
const CEARA_ZOOM   = 7

function createMarkerIcon(museum) {
  const style = getCategoryStyle(museum.categoria)
  const color = style.mapColor ?? style.border

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <defs>
        <filter id="shadow-${museum.id}" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}" filter="url(#shadow-${museum.id})"/>
      <circle cx="14" cy="14" r="5.5" fill="white" opacity="0.9"/>
    </svg>
  `.trim()

  return L.divIcon({
    html: svgContent,
    className: '',           
    iconSize:   [28, 36],
    iconAnchor: [14, 36],    
    popupAnchor:[0, -38],    
  })
}

function createPopupContent(museum) {
  const style   = getCategoryStyle(museum.categoria)
  const color   = style.mapColor ?? style.border
  const hasA11y = museum.acessibilidade && museum.acessibilidade !== 'Não informado'

  const a11yBadge = hasA11y ? `
    <span style="display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:9999px; background:#FEF3C7; color:#92400E; font-size:11px; font-weight:600; border:1px solid #FDE68A;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="4" r="2"/><path d="M19 13v-2c0-1.1-.9-2-2-2h-3l-2-4H8.5c-.83 0-1.5.67-1.5 1.5v.5L9 10.5V13H6v2h3v5h2v-5h3v-2h-3v-2.5l-1.5-3H14l2 4h3v2l-2.5 7H19l2.5-7z"/>
      </svg>
      Acessível
    </span>
  ` : ''

  return `
    <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; min-width: 220px; max-width: 280px;">
      <div style="height:4px; background:${color}; margin:-1px -1px 0 -1px; border-radius:4px 4px 0 0;"></div>
      <div style="padding:12px 14px 14px;">
        <div style="margin-bottom:6px; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
          <span style="display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:9999px; background:${color}18; color:${color}; font-size:11px; font-weight:700; letter-spacing:0.01em;">
            <span style="width:6px;height:6px;border-radius:50%;background:${color};display:inline-block;"></span>
            ${museum.categoria}
          </span>
          ${a11yBadge}
        </div>
        <h3 style="margin:0 0 4px; font-size:14px; font-weight:700; color:#0F2A4A; line-height:1.3;">${museum.nome}</h3>
        <p style="margin:0 0 12px; font-size:12px; color:#64748B; display:flex; align-items:center; gap:4px;">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${museum.cidade}, CE
        </p>
        <a href="${museum.mapsUrl || '#'}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:7px 0; border-radius:10px; background:${color}; color:white; font-size:12px; font-weight:600; text-decoration:none; box-sizing:border-box;" ${!museum.mapsUrl ? 'aria-disabled="true" style="pointer-events:none;opacity:0.5;"' : ''}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          Ver no Google Maps
        </a>
      </div>
    </div>
  `
}

async function initMap() {
  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  if (!mapContainer.value) return

  mapInstance = L.map(mapContainer.value, {
    center: CEARA_CENTER,
    zoom: CEARA_ZOOM,
    zoomControl: true,
    attributionControl: true,
    minZoom: 5,
    maxZoom: 18,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(mapInstance)

  markersLayer = L.layerGroup().addTo(mapInstance)
  plotMarkers(L)

  resizeObserver = new ResizeObserver(() => {
    if (mapInstance) {
      mapInstance.invalidateSize()
    }
  })
  resizeObserver.observe(mapContainer.value)
}

function plotMarkers(L) {
  if (!markersLayer) return
  markersLayer.clearLayers()

  const museumsWithCoords = props.museums.filter(m => m.lat != null && m.lng != null)

  museumsWithCoords.forEach((museum) => {
    const marker = L.marker([museum.lat, museum.lng], {
      icon: createMarkerIcon(museum),
      title: museum.nome,
      alt: museum.nome,
    })

    marker.bindPopup(createPopupContent(museum), {
      maxWidth: 300,
      minWidth: 240,
      className: 'museum-popup', 
    })

    marker.on('click', () => { emit('museum-click', museum) })
    markersLayer.addLayer(marker)
  })

  return museumsWithCoords.length
}

watch(
  () => props.museums,
  async () => {
    if (!mapInstance) return
    const L = await import('leaflet')
    plotMarkers(L)
  },
  { deep: false }   
)

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (resizeObserver && mapContainer.value) {
    resizeObserver.unobserve(mapContainer.value)
  }
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm">

    <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style="background-color: #0F2A4A;"
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
        </div>
        <div>
          <p class="text-xs font-bold text-slate-800 leading-none">Mapa dos Museus</p>
          <p class="text-xs text-slate-400 leading-none mt-0.5">
            {{ museums.filter(m => m.lat && m.lng).length }} museus plotados
          </p>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-3 text-xs text-slate-500">
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#1A6B5A;"></span>
          História
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#E8A020;"></span>
          Artes / Cultura
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#0369A1;"></span>
          Ciências
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#B45309;"></span>
          Arqueologia
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#7C3AED;"></span>
          Memória
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#166534;"></span>
          Ecomuseu
        </span>
      </div>
    </div>

    <div
      ref="mapContainer"
      :style="{ height: height }"
      class="w-full"
      role="application"
      aria-label="Mapa interativo dos museus do Ceará"
    />

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="museums.filter(m => m.lat && m.lng).length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20"
        role="status"
        aria-live="polite"
      >
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
        </div>
        <p class="text-slate-600 font-semibold text-sm">Nenhum museu no mapa</p>
        <p class="text-slate-400 text-xs mt-1">Os filtros ativos não retornaram resultados com coordenadas.</p>
      </div>
    </Transition>

  </div>
</template>

<style>
.museum-popup .leaflet-popup-content-wrapper {
  padding: 0;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08);
  border: 1px solid #E2E8F0;
  overflow: hidden;
}

.museum-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.4;
}

.museum-popup .leaflet-popup-tip-container {
  display: none;
}

.museum-popup .leaflet-popup-close-button {
  top: 8px !important;
  right: 8px !important;
  width: 20px !important;
  height: 20px !important;
  font-size: 16px !important;
  color: #94A3B8 !important;
  background: white !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 1 !important;
}

.museum-popup .leaflet-popup-close-button:hover {
  color: #0F2A4A !important;
}

.leaflet-control-zoom a {
  color: #0F2A4A !important;
  font-weight: 700 !important;
}

.leaflet-control-zoom a:hover {
  background-color: #F5F2EC !important;
}

/* Atribuição do mapa */
.leaflet-control-attribution {
  font-size: 10px !important;
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(4px);
}
</style>
