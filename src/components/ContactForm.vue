<template>
    <h2 class="header-title">
      {{ headerTitle }}
    </h2>
    <n-form
      @submit.prevent="createRedactContact"
      ref="contactFormRef"
      :model="contactValues"
      :rules="validationRules"
    >
      <n-form-item
        label="ФИО"
        path="full_name"
      >
        <n-input
          type="text"
          v-model:value="contactValues.full_name"
          placeholder="ФИО"
          :allow-input="trimValue"
        />
      </n-form-item>
      <n-form-item
        label="Номер телефона"
        path="phone_number"
      >
        <n-input
          type="text"
          v-model:value="contactValues.phone_number"
          placeholder="номер телефона"
          :allow-input="onlyNumber"
        />
      </n-form-item>
      <n-form-item
        label="Эл. адрес"
        path="email"
      >
        <n-input
          type="text"
          v-model:value="contactValues.email"
          placeholder="Эл. адрес"
          :allow-input="trimValue"
        />
      </n-form-item>
      <n-form-item
        label="Теги"
        path="tagIdList"
      >
        <n-select
          v-model:value="contactValues.tagIdList"
          multiple
          :options="tagsList || []"
          label-field="value"
          value-field="id"
          placeholder="теги"
        />
      </n-form-item>
      <div class="submit-button">
        <n-button
          v-if="!isCreationMode"
          type="error"
          @click="removeContact"
        >
          Удалить
        </n-button>
        <n-button
          type="primary"
          attr-type="submit"
        >
          Сохранить
        </n-button>
      </div>
    </n-form>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NSelect, useNotification, NButton, type FormInst, type FormRules} from "naive-ui";
import { inject, ref, computed, onMounted, toRaw } from "vue";
import { useRouter } from "vue-router";
import type { Contact, ContactTags } from "../request_worker/entity/contact/entity/";
import { useAppRequestHandler } from "../composables/app_req_handler";
import { ContactsInjectionKey } from "../request_worker";

const props = defineProps({
  contactId: Number
})

const contactRequestWorker = inject(ContactsInjectionKey)!
const router = useRouter()
const notification = useNotification()

const tagsList = ref<ContactTags[] | null>(null)
const contactFormRef = ref<FormInst | null>(null)
const contactValues = ref<Contact>({
  id: 0,
  full_name: "",
  phone_number: "",
  email: "",
  tagIdList: [],
  tags: []
})
const validationRules : FormRules = {
  full_name: {
    required: true,
    min: 3,
    message: "введите ФИО"
  },
  phone_number: {
    required: true,
    min: 7,
    message: "введите номер телефона"
  }
}

const headerTitle = computed(() : string => props.contactId ? "Редактировать контакт" : "Создать контакт") 
const isCreationMode = computed(() : boolean => props.contactId === undefined)

const handleLoadTags = useAppRequestHandler(contactRequestWorker.loadTags)
const handleGetContact = useAppRequestHandler(contactRequestWorker.getContact)
const trimValue = (value: string) => !/ /g.test(value)
const onlyNumber = (value: string) => !value || /^\d+$/.test(value)

const loadTags = async () : Promise<void> => {
  tagsList.value = await handleLoadTags()
}

const getContact = async () : Promise<void> => {
  if (!isCreationMode.value) {
    const response = await handleGetContact(props.contactId)
    if (response) {
      contactValues.value = response
    }
  }
}

const createRedactContact = async () : Promise<void> => {
  try {
    const payload = toRaw(contactValues.value)
    const id = await contactRequestWorker.createRedactContact(payload)

    if(isCreationMode.value) {
      router.push(`/contact/${id}`)
      notification.success({
        title: "Контакт создан",
        duration: 3000,
      })

      return
    }
    
    await getContact()
    notification.success({
      title: "Контакт отредактирован",
      duration: 3000,
    })
  } catch (err: any) {
    notification.error({
      title: err.message,
      duration: 3000,
      keepAliveOnHover: true
    })
  }
}

const removeContact = async () : Promise<void> => {
  try {
    await contactRequestWorker.removeContact(props.contactId!)
    notification.success({
      title: "Контакт удален",
      duration: 3000,
    })
    router.push("/")
  } catch (err: any) {
    notification.error({
      title: err.message,
      duration: 3000,
      keepAliveOnHover: true
    })
  }
}

onMounted(async () => {
  await getContact()
  await loadTags()
})

</script>

<style scoped>
  .header-title {
    margin-bottom: 20px;
  }

  .submit-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }
</style>
