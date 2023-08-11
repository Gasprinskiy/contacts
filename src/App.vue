<template>
   <router-view/>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { useNotification } from "naive-ui";
import { computed, inject, onBeforeMount } from "vue";
import { AuthInjectionKey } from "@/request_worker/";
import { useAppRequestHandler } from "@/composables/app_req_handler/";
import app_bus from "./shared/app_bus";

const router = useRouter()
const route = useRoute()
const notification = useNotification()
const authRequestWorker = inject(AuthInjectionKey)!

const notAuthRoute = computed(() => route.name !== "Auth")

app_bus.on("unauthorized_request", () => {
    if(notAuthRoute.value) {
        notification.warning({
            title: "Необходимо авторизоватся в системе",
            duration: 3000
        })
        router.push("/auth")
    }
})

const handleCheckAuth = useAppRequestHandler(authRequestWorker.checkAuth)

onBeforeMount(async () => await handleCheckAuth())

</script>

<style scoped>

</style>
