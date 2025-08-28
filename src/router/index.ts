import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      // For now, let's point it to the operators view as the main page
      component: () => import('../views/OperateursView.vue'),
    },
    {
      path: '/operateurs',
      name: 'operateurs',
      component: () => import('../views/OperateursView.vue'),
    },
    {
      path: '/operateur/:id',
      name: 'operateur-details',
      component: () => import('../views/OperatorDetailView.vue'),
      props: true,
    },
    {
      path: '/machines',
      name: 'machines',
      // Placeholder component
      component: () => import('../views/MachinesView.vue'),
    },
  ],
})

export default router
