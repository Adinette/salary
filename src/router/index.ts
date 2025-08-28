import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/operateurs',
      name: 'operateurs',
      component: () => import('../views/OperateursView.vue'),
    },
    {
      path: '/machines',
      name: 'machines',
      component: () => import('../views/MachinesView.vue'),
    },
  ],
})

export default router
