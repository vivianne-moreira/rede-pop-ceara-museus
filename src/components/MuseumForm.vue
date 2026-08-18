<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 class="text-lg font-bold text-slate-800">
          {{ isEditing ? 'Atualizar Equipamento' : 'Cadastrar Novo Museu' }}
        </h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">Nome do Museu *</label>
            <input v-model="formData.nome" type="text" required class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">Cidade *</label>
            <input v-model="formData.cidade" type="text" required class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">Categoria Temática</label>
            <input v-model="formData.categoria" type="text" placeholder="Ex: História" class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">Acessibilidade</label>
            <input v-model="formData.acessibilidade" type="text" placeholder="Ex: Rampa, piso tátil..." class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
        </div>

        <div>
          <label class="block mb-1 text-xs font-semibold text-slate-600">Endereço Completo</label>
          <input v-model="formData.endereco" type="text" placeholder="Rua, número, bairro..." class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">Telefone</label>
            <input v-model="formData.telefone" type="text" class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">E-mail</label>
            <input v-model="formData.email" type="email" class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
          <div>
            <label class="block mb-1 text-xs font-semibold text-slate-600">Site/Blog</label>
            <input v-model="formData.site" type="url" class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
          </div>
        </div>

        <div>
          <label class="block mb-1 text-xs font-semibold text-slate-600">Link do Google Maps</label>
          <input v-model="formData.mapsUrl" type="url" class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50" />
        </div>

        <div>
          <label class="block mb-1 text-xs font-semibold text-slate-600">Observações / Notas</label>
          <textarea v-model="formData.observacoes" rows="2" class="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50"></textarea>
        </div>
        
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
          <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" class="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm transition-all active:scale-95" style="background-color: #1A6B5A;">
            {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Museu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = ref(false)
const formData = ref({
  nome: '', cidade: '', categoria: 'Não informado', endereco: '',
  telefone: '', email: '', site: '', mapsUrl: '', acessibilidade: '',
  observacoes: '', lat: null, lng: null
})

onMounted(() => {
  if (props.initialData) {
    isEditing.value = true
    formData.value = { ...props.initialData }
  }
})

const handleSubmit = () => {
  emit('save', formData.value)
}
</script>