<script lang="ts" setup>
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router';
import { createPerson, deletePerson, getPerson, updatePerson } from '../../datasource/people';
import { ref } from 'vue';
import { reactive } from 'vue';

const props = defineProps<{ id: string }>()
const router = useRouter()

const loadingGet = ref(false)
const loadingSave = ref(false)
const errorGet = ref(false)
const errorSave = ref(false)
const errorMessage = ref('')

const model = reactive({
  name: '',
  document: '',
  stateRegistration: '',
  corporateName: '',
  fantasyName: '',
  phone: '',
  email: '',
  observation: '',
  address: {}
})

const fetchModel = async () => {
  try {
    loadingGet.value = true
    const data = await getPerson(props.id as string);

    model.address = {
      zipCode: data.address?.zipCode,
      street: data.address?.street,
      number: data.address?.number,
      complement: data.address?.complement,
      neighborhood: data.address?.neighborhood,
      federativeUnit: data.address?.federativeUnit,
      city: data.address?.city,
      state: data.address?.state,
    }
    model.document = data.document
    model.email = data.email
    model.name = data.name
    model.phone = data.phone
    model.corporateName = data.corporateName
    model.fantasyName = data.fantasyName
    model.stateRegistration = data.stateRegistration
    model.observation = data.observation

    return data;
  } catch(e) {
    console.log(e)

    errorGet.value = true
  } finally {
    loadingGet.value = false
  }
}

const saveModel = async (mode: 'edit' | 'create' | 'delete') => {
  const modes: Record<string, Function> = {
    edit: async () => await updatePerson(props.id as string, model),
    create: async () => await createPerson(model),
    delete: async () => await deletePerson(props.id as string),
  }

  try {
    loadingSave.value = true
    await modes[mode]()

    router.push({ name: 'list-people' })
  } catch(e) {
    const error = e as AxiosError

    errorSave.value = true
    errorMessage.value = JSON.stringify(error.response?.data) || 'Erro ao salvar pessoa'
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
path: /pessoas/:id
</route>
