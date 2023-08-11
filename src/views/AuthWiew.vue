<template>
    <div class="auth-view full-screen">
      <n-card>
        <n-form 
          ref="authRef"
          @submit.prevent="auth"
          :model="authValues"
          :rules="validationRules"
        >
          <h2 class="auth-heder">Вход</h2>
          <n-form-item
            label="Логин"
            path="login"
          >
            <n-input
              type="text"
              v-model:value="authValues.login"
              placeholder="логин"
            />
          </n-form-item>
          <n-form-item
            label="Пароль"
            path="password"
          >
            <n-input
              type="password"
              v-model:value="authValues.password"
              placeholder="пароль"
            />
          </n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
          >
            Войти
          </n-button>
        </n-form>
      </n-card>
    </div>
</template>
  
<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton, type FormRules, type FormInst } from "naive-ui";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { AuthInjectionKey } from "@/request_worker/";
import { useAppRequestHandler } from "@/composables/app_req_handler/";
import type { AuthParams } from "@/request_worker/entity/auth/params";

const router = useRouter()
const authRequestWorker = inject(AuthInjectionKey)!

const authRef = ref<FormInst | null>(null)
const authValues = ref<AuthParams>({
  login: "",
  password: ""
})

const validationRules : FormRules = {
  login: {
    required: true,
    message: "введите ваш логин"
  },
  password: {
    required: true,
    message: "введите ваш пароль"
  }
}

const handleAuthRequest = useAppRequestHandler(authRequestWorker.sigIn)

const auth = async () : Promise<void> => {  
  authRef.value?.validate(async (err) => {
    if (err) {
      return
    }
    const response = await handleAuthRequest(authValues.value)
    if (response !== null) {
      await router.push("/")
    }
  })
}

</script>
  
<style scoped>
  .auth-view {
    display: flex;
    justify-content: center;
    align-items: center;
    .n-card {
      max-width: 500px;
    }
    .auth-heder {
      margin-bottom: 10px;
    }

    .n-button {
      width: 100%;
      margin-top: 10px;
    }
  }
</style>
  