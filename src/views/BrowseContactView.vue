<template>
    <contact-form
      :contact-id="contactID"
    />
</template>
 
<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ContactForm from "@/components/ContactForm.vue";

const route = useRoute()
const contactID = computed((): number => Number(route.params.id))
</script>