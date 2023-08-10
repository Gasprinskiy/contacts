import { createRouter, createWebHistory } from 'vue-router'
import AuthWiew from "@/views/AuthWiew.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Auth",
      component: AuthWiew
    },
  ]
})

export default router
