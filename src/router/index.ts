import { createRouter, createWebHistory } from 'vue-router'
import AuthWiew from "@/views/AuthWiew.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView
    },
    {
      path: "/auth",
      name: "Auth",
      component: AuthWiew
    },
  ]
})

export default router
