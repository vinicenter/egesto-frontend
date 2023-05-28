<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { createUser, getUser, deleteUser, updateUser } from '../../datasource/auth';
import { reactive } from 'vue';
import { ref } from 'vue';

const { params } = useRoute()
const router = useRouter()

const loadingGet = ref(false)
const loadingSave = ref(false)
const error = ref(false)

const model = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const fetchModel = async () => {
  try {
    loadingGet.value = true
    const data = await getUser(params.id as string);

    model.email = data.result.document.email;
    model.username = data.result.document.username;
    model.name = data.result.document.name;
    model.password = data.result.document.password;

    return data;
  } catch(e) {
    error.value = true
  } finally {
    loadingGet.value = false
  }
}

const saveModel = async (mode: 'edit' | 'create' | 'delete') => {
  const modes: Record<string, Function> = {
    edit: async () => await updateUser(params.id as string, { ...model }),
    create: async () => await createUser({ ...model }),
    delete: async () => await deleteUser(params.id as string),
  }

  try {
    loadingSave.value = true
    await modes[mode]()

    router.push({ name: 'list-users' })
  } catch(e) {
    error.value = true
  } finally {
    loadingSave.value = false
  }
}

const refetch = () => {
  error.value = false
  fetchModel()
}

fetchModel()
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

  <EError v-else-if="error" @refetch="refetch" />

  <RouterView
    v-else
    :model="model"
    :loading="loadingSave"
    @submit="saveModel"
  />
</template>

<route lang="yaml">
path: /usuarios/:id
</route>
