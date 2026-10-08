import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MuseumDetails from '@/components/MuseumDetails.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Mapa de Museus — Rede Pop Ceará',
    },
  },
  {
  path: '/museu/:id',
  name: 'MuseumDetails',
  component: MuseumDetails,
  meta: {
    title: 'Detalhes do Museu — Rede Pop Ceará',
  },
}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
