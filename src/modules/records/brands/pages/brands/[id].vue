<script lang="ts" setup>
import type { AxiosError } from 'axios'
const props = defineProps<{ id: string }>()

import { useRouter } from 'vue-router';
import { createBrand, getBrand, deleteBrand, updateBrand } from '../../datasource/brands';
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
  description: '',
})

const fetchModel = async () => {
  try {
    loadingGet.value = true
    const data = await getBrand(props.id as string);

    model.name = data.name;
    model.description = data.description;

    return data;
  } catch(e) {
    errorGet.value = true
  } finally {
    loadingGet.value = false
  }
}

const saveModel = async (mode: 'edit' | 'create' | 'delete') => {
  const modes: Record<string, Function> = {
    edit: async () => await updateBrand(props.id as string, { 
      ...model,
    }),

    create: async () => await createBrand({
      ...model,
    }),

    delete: async () => await deleteBrand(props.id as string),
  }

  try {
    loadingSave.value = true
    await modes[mode]()

    router.push({ name: 'list-brands' })
  } catch(e) {
    const error = e as AxiosError

    errorSave.value = true
    errorMessage.value = JSON.stringify(error.response?.data) || 'Erro ao salvar marca'
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
path: /marcas/:id
</route>
