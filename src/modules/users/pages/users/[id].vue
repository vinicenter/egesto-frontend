<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { getUser } from '../../datasource/auth';
import { reactive } from 'vue';
import { ref } from 'vue';

const { params } = useRoute()

const loading = ref(false)
const error = ref(false)

const model = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const fetchModel = async () => {
  try {
    loading.value = true
    const data = await getUser(params.id as string);

    model.email = data.result.document.email;
    model.username = data.result.document.username;
    model.name = data.result.document.name;
    model.password = data.result.document.password;

    return data;
  } catch(e) {
    error.value = true
  } finally {
    loading.value = false
  }
}

// const saveModel = async () => {
//   console.log(model)
// }

const refetch = () => {
  error.value = false
  fetchModel()
}

fetchModel()
</script>

<template>
  <div
    v-if="loading"
    class="flex justify-center items-center"
  >
    <VProgressCircular
      indeterminate
      :size="62"
    />
  </div>

  <EError v-else-if="error" @refetch="refetch" />

  <RouterView v-else :model="model" />
</template>

<route lang="yaml">
path: /usuarios/:id
</route>
