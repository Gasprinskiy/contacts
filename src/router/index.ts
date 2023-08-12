import { createRouter, createWebHistory } from "vue-router";
import AuthWiew from "@/views/AuthWiew.vue";
import HomeView from "@/views/HomeView.vue";
import BrowseContactView from "@/views/BrowseContactView.vue";
import CreateContactView from '@/views/CreateContactView.vue';

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
    {
      path: "/contact/:id",
      name: "BrowseContact",
      component: BrowseContactView
    },
    {
      path: "/contact_create",
      name: "CreateContact",
      component: CreateContactView
    }
  ]
})

export default router
