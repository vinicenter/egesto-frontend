<script lang="ts" setup>
import type { AxiosError } from 'axios'
const props = defineProps<{ id: string }>()

import { useRouter } from 'vue-router';
import { createUser, getUser, deleteUser, updateUser } from '../../datasource/auth';
import { reactive } from 'vue';
import { ref } from 'vue';

const router = useRouter()

const loadingGet = ref(false)
const loadingSave = ref(false)
const errorGet = ref(false)
const errorSave = ref(false)
const errorMessage = ref('')

const model = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const fetchModel = async () => {
  try {
    loadingGet.value = true
    const data = await getUser(props.id as string);

    model.email = data.email;
    model.username = data.username;
    model.name = data.name;
    model.password = data.password;

    return data;
  } catch(e) {
    errorGet.value = true
  } finally {
    loadingGet.value = false
  }
}

const saveModel = async (mode: 'edit' | 'create' | 'delete') => {
  const modes: Record<string, Function> = {
    edit: async () => await updateUser(props.id as string, { 
      ...model,
      email: model.email || undefined,
      password: model.password ? model.password : undefined,
    }),

    create: async () => await createUser({
      ...model,
      email: model.email || undefined,
      password: model.password ? model.password : undefined,
    }),

    delete: async () => await deleteUser(props.id as string),
  }

  try {
    loadingSave.value = true
    await modes[mode]()

    router.push({ name: 'list-users' })
  } catch(e) {
    const error = e as AxiosError

    errorSave.value = true
    errorMessage.value = JSON.stringify(error.response?.data) || 'Erro ao salvar usuário'
  } finally {
    loadingSave.value = false
  }
}

const refetch = () => {
  errorGet.value = false
  fetchModel()
}

if(props.id !== 'novo') fetchModel()
</script>

<template>
  <div
    v-if="loadingGet"
    class="flex justify-center items-center"
  >
    <VProgressCircular
      indeterminate
      :size="62"
    />
  </div>

  <EError v-else-if="errorGet" @refetch="refetch" />

  <RouterView
    v-else
    :model="model"
    :loading="loadingSave"
    @submit="saveModel"
  />

  <VSnackbar
    v-model="errorSave"
    color="error"
    top
  >
    {{ errorMessage }}
  </VSnackbar>
</template>

<route lang="yaml">
path: /usuarios/:id
</route>
