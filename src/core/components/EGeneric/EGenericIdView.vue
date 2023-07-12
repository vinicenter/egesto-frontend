<script lang="ts" setup>
import { ref } from 'vue';
import type { AxiosError } from 'axios'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
const props = defineProps<{
  id: string,
  getFn: Function,
  createFn: Function,
  updateFn: Function,
  deleteFn: Function,
  formatSubmitFn: Function,
  model: Record<string, any>,
}>()

const emit = defineEmits(['finish', 'load'])

const loadingGet = ref(false)
const loadingSave = ref(false)
const errorGet = ref(false)
const errorSave = ref(false)
const errorMessage = ref('')

const fetchModel = async () => {
  try {
    loadingGet.value = true
    const data = await props.getFn(props.id as string);

    emit('load', data)
  } catch(e) {
    errorGet.value = true
  } finally {
    loadingGet.value = false
  }
}

const saveModel = async (mode: 'edit' | 'create' | 'delete') => {
  const modes: Record<string, Function> = {
    edit: async () => {
      const data = await props.formatSubmitFn(props.model)

      await props.updateFn(props.id as string, data)
    },
    create: async () => {
      const data = await props.formatSubmitFn(props.model)

      await props.createFn(data)
    },
    delete: async () => await props.deleteFn(props.id as string),
  }

  try {
    loadingSave.value = true
    await modes[mode]()

    emit('finish')
  } catch(e) {
    const error = e as AxiosError

    errorSave.value = true
    errorMessage.value = JSON.stringify(error.response?.data) || 'Erro ao salvar'
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
  <div v-if="loadingGet">
    <VSkeletonLoader type="text" />
    <VSkeletonLoader type="text" />
    <VSkeletonLoader type="text" />
    <VSkeletonLoader type="text" />
    <VSkeletonLoader type="button" />
  </div>

  <EError v-else-if="errorGet" @refetch="refetch" />

  <slot
    v-else
    :loading="loadingSave"
    :submit="saveModel"
  />

  <VSnackbar
    v-model="errorSave"
    color="error"
    top
  >
    {{ errorMessage }}
  </VSnackbar>
</template>
