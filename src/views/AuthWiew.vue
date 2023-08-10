<template>
    <div class="auth-view full-screen">
      <n-card>
        <n-form>
          <n-form-item
            label="Эл. почта"
          >
            <n-input
              type="text"
              v-model:value="email"
            />
          </n-form-item>
          <n-form-item
              label="Пароль"
          >
            <n-input
              type="password"
              v-model:value="password"
            />
          </n-form-item>
        </n-form>
      </n-card>
    </div>
</template>
  
<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";

const email = ref<string|null>(null)
const password = ref<string|null>(null)

</script>
  
<style scoped>
  .auth-view {
    display: flex;
    justify-content: center;
    align-items: center;
    .n-card {
      max-width: 500px;
    }
  }
</style>
  