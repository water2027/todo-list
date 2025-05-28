import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Default',
      component: () => import('@/layout/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'option',
          name: 'Option',
          component: () => import('@/views/OptionView.vue'),
        },
        {
          path: 'clock',
          name: 'Clock',
          component: () => import('@/views/ClockView.vue'),
        },
        {
          path: 'todo-list',
          name: 'TodoList',
          component: () => import('@/views/TodoListView.vue'),
        },
        {
          path: 'task',
          name: 'Task',
          component: () => import('@/views/TaskView.vue'),
        }
      ],
    },
  ],
})

export default router
