<template>
    <div class="full-screen">
      <n-layout>
        <n-layout-header class="header">
          <h1>
            Контакты
          </h1>
          <div class="header-buttons">
            <n-button
              @click="goToContactCreate"
              type="primary"
            >
              <template #icon>
                <n-icon>
                  <AddCircleOutline/>
                </n-icon>
              </template>
              Добавить контакт
            </n-button>
            <n-button
              @click="signOut"
            >
              <template #icon>
                <n-icon>
                  <LogOutOutline/>
                </n-icon>
              </template>
            </n-button>
          </div>
        </n-layout-header>
        <n-layout-content class="search-bar">
          <n-form
            ref="searchFormRef"
            @submit.prevent="findContract"
            :model="searchValues"
            :rules="validationRules"
          >
            <n-form-item
              path="query"
            >
              <n-input
                type="text"
                v-model:value.trim="searchValues.query"
                placeholder="запрос"
              />
            </n-form-item>
            <n-form-item
              path="tagIdList"
            >
              <n-select
                v-model:value="searchValues.tagIdList"
                multiple
                :options="tagsList || []"
                label-field="value"
                value-field="id"
                placeholder="теги"
              />
            </n-form-item>
            <div class="submit-button">
              <n-button
                secondary 
                type="warning"
                attr-type="reset"
                @click="resetValues"
              >
                Сбросить
              </n-button>
              <n-button
                type="primary"
                attr-type="submit"
              >
                Поиск
              </n-button>
            </div>
          </n-form>
        </n-layout-content>
        <n-layout-content class="contact-table">
          <n-data-table
            :data="contactList || []"
            :columns="contactListColumns || []"
            :max-height="350"
          />
        </n-layout-content>
      </n-layout>
    </div>
</template>

<script setup lang="ts">
import {
  NLayoutHeader,
  NLayout,
  NLayoutContent,
  NButton,
  NIcon,
  NForm,
  type FormInst,
  type FormRules,
  type DataTableColumns,
  NInput, NFormItem,
  NSelect,
  NDataTable,
  NTag
} from "naive-ui";
import { AddCircleOutline, LogOutOutline } from "@vicons/ionicons5";
import { h, inject, onBeforeMount, ref} from "vue";
import { useRouter } from "vue-router";
import { ContactsInjectionKey, AuthInjectionKey } from "@/request_worker";
import { useAppRequestHandler } from "@/composables/app_req_handler";
import type { Contact, ContactTags} from "@/request_worker/entity/contact/entity";
import type { ContactSearchParam } from "@/request_worker/entity/contact/params";

const router = useRouter()
const contactRequestWorker = inject(ContactsInjectionKey)!
const authRequestWorker = inject(AuthInjectionKey)!

const searchValues = ref<ContactSearchParam>({
  query: "",
})
const searchFormRef = ref<FormInst | null>(null)
const validationRules : FormRules = {
  query: {
    required: true,
    message: "введите запрос"
  }
}
const tagsList = ref<ContactTags[] | null>(null)
const contactList = ref<Contact[] | null>(null)
const contactListColumns = ref<DataTableColumns<Contact> | null>(null)

const handleLoadTags = useAppRequestHandler(contactRequestWorker.loadTags)
const handleLoadContacts = useAppRequestHandler(contactRequestWorker.loadContactsList)
const handleFinContractRequest = useAppRequestHandler(contactRequestWorker.findContact)
const handleSignOut = useAppRequestHandler(authRequestWorker.signOut)

const createContactColumns = (goToContact: (row: Contact) => void) : DataTableColumns<Contact> => {
  return [
    {
      title: "ФИО",
      key: "full_name",
    },
    {
      title: "Номер телефона",
      key: "phone_number",
    },
    {
      title: "Эл. адрес",
      key: "email",
    },
    {
      title: "Теги",
      key: "tags",
      render: (row: Contact) => {
        return row.tags?.map((tag: ContactTags) => {
          return h(
              NTag,
              {
                style: {
                  marginRight: '6px'
                },
                type: 'info',
                bordered: false
              },
              {default: () => tag.value}
          )
        })
      }
    },
    {
      key: "action",
      render: (row: Contact) => {
        return h(
            NButton,
            {
              size: 'small',
              onClick: () => goToContact(row)
            },
            { default: () => 'Подробнее' }
        )
      }
    }
  ]
}

const goToContact = (row: Contact) : void => {
  router.push(`/contact/${row.id}`)
}

const goToContactCreate = () : void => {
  router.push(`/contact_create`)
}

const loadTags = async () : Promise<void> => {
  tagsList.value = await handleLoadTags()
}

const loadContacts = async () : Promise<void> => {
  contactList.value = await handleLoadContacts()
  contactListColumns.value = createContactColumns(goToContact)
}

const findContract = async () : Promise<void> => {
  searchFormRef.value?.validate(async (err) => {
    if (err) {
      return
    }

    contactList.value = await handleFinContractRequest(searchValues.value)
  })
}

const resetValues = async () : Promise<void> => {
  searchValues.value.query = ""
  searchValues.value.tagIdList = []

  await loadContacts()
}

const signOut = async () : Promise<void> => {
  await handleSignOut()

  router.push("/auth")
}

onBeforeMount(async () => {
  await loadTags()
  await loadContacts()
})
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .submit-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }

  .contact-table {
    margin-top: 20px;
  }

  .header-buttons {
    display: flex;
    gap: 5px;
  }

</style>
