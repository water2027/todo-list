import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'Default',
        component: () => import('@/layout/DefaultLayout.vue'),
        children: [{
            path: '',
            name: 'Home',
            component: () => import('@/views/HomeView.vue')
        }
        ]
    }
  ]
})

export default router