import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("../views/ProjectView.vue")
    },
    {
      path: '/add',
      name: 'add',
      component: () => import("../views/AddProjectView.vue")
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import("../views/SettingView.vue")
    },
  ]
})

export default router
