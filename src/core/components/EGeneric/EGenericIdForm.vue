<script setup lang="ts">
import { computed, ref } from 'vue';
import useNotify from '../../composables/useNotify';
import { AxiosError } from 'axios';

const props = defineProps<{
  id: string | 'novo',
  type: 'criar' | 'deletar' | 'editar' | 'clonar'
  getFn: Function
  createFn: Function
  deleteFn: Function
  updateFn: Function
  formatSubmitFn: Function
  initialValuesCreate: unknown
  formatInitialValues?: Function
}>()

const loadingGet = ref(false);
const errorGet = ref(false);
const data = ref<unknown>(props.initialValuesCreate);

const emit = defineEmits<{
  (e: 'finish', values: unknown): void
}>()

const fetchModel = async () => {
  try {
    loadingGet.value = true
    errorGet.value = false

    const result = await props.getFn(props.id);
    
    props.formatInitialValues
      ? data.value = props.formatInitialValues(result)
      : data.value = result
  } catch {
    errorGet.value = true
  } finally {
    loadingGet.value = false
  }
}

const buttonLabel = computed(() => {
  const options: Record<typeof props.type, string> = {
    criar: 'Criar',
    deletar: 'Deletar',
    editar: 'Editar',
    clonar: 'Clonar',
  }

  return options[props.type]
})

const { displayMessage } = useNotify();

const loadingSubmit = ref(false);

const submit = async (values: unknown) => {
  const options: Record<typeof props.type, () => void> = {
    criar: () => saveModel('create', values),
    editar: () => saveModel('edit', values), 
    clonar: () => saveModel('create', values),
    deletar: () => saveModel('delete', values),
  }

  options[props.type]()
}

const saveModel = async (mode: 'edit' | 'create' | 'delete', values: unknown) => {
  const modes: Record<string, Function> = {
    edit: async () => {
      const data = await props.formatSubmitFn(values)

      await props.updateFn(props.id as string, data)
    },
    create: async () => {
      const data = await props.formatSubmitFn(values)

      await props.createFn(data)
    },
    delete: async () => await props.deleteFn(props.id as string),
  }

  try {
    loadingSubmit.value = true
    await modes[mode]()

    emit('finish', values)

    displayMessage({
      message: 'Salvo com sucesso',
      type: 'success'
    })
  } catch(e) {
    const error = e as AxiosError

    const response = error.response?.data as { message?: string } | undefined
    const message = response?.message || 'Erro ao salvar: ' + error.stack

    displayMessage({
      message,
      type: 'error'
    })
  } finally {
    loadingSubmit.value = false
  }
}

const refetch = () => {
  fetchModel()
}

if(props.id !== 'novo') {
  fetchModel()
}
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
    :data="data"
    :button-label="buttonLabel"
    :submit="submit"
    :loadingSubmit="loadingSubmit"
  />
</template>
