<script setup lang="ts">
import { computed, ref } from 'vue';
import useNotify from '../../composables/useNotify';
import { RouteLocationRaw, useRouter } from 'vue-router';

const props = defineProps<{
  id: string | 'novo',
  type: 'criar' | 'deletar' | 'editar'
  getFn: Function
  createFn: Function
  deleteFn: Function
  updateFn: Function
  redirectTo: RouteLocationRaw
}>()

const loadingGet = ref(false);
const errorGet = ref(false);
const data = ref<any>();

const fetchModel = async () => {
  try {
    loadingGet.value = true
    errorGet.value = false

    const result = await props.getFn(props.id);

    data.value = result
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
  }

  return options[props.type]
})

const router = useRouter();
const { displayMessage } = useNotify();

const loadingSubmit = ref(false);

const submit = async (values: any) => {
  const options: Record<typeof props.type, any> = {
    criar: () => create(values),
    editar: () => update(values), 
    deletar: () => remove(),
  }

  console.log(props.type)

  options[props.type]()
}

const create = async (values: any) => {
  try {
    loadingSubmit.value = true

    await props.createFn(values)

    router.push(props.redirectTo)

    displayMessage({
      type: 'success',
      message: 'Criado com sucesso'
    })
  } catch {
    displayMessage({
      type: 'error',
      message: 'Erro ao criar'
    })
  } finally {
    loadingSubmit.value = false
  }
}

const remove = async () => {
  try {
    loadingSubmit.value = true

    await props.deleteFn(props.id)

    router.push(props.redirectTo)

    displayMessage({
      type: 'success',
      message: 'Deletado com sucesso'
    })
  } catch {
    displayMessage({
      type: 'error',
      message: 'Erro ao deletar'
    })
  } finally {
    loadingSubmit.value = false
  }
}

const update = async (values: any) => {
  try {
    loadingSubmit.value = true

    await props.updateFn(props.id, values)

    router.push(props.redirectTo)

    displayMessage({
      type: 'success',
      message: 'Editado com sucesso'
    })
  } catch {
    displayMessage({
      type: 'error',
      message: 'Erro ao editar'
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
