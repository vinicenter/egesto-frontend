<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createUser, getUser, deleteUser, updateUser } from '../../datasource/auth';
import { IUser } from '../../types/auth'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const loadModel = (data: IUser) => {
  model.name = data.name;
  model.email = data.email || '';
  model.username = data.username;
  model.password = data.password || '';
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="(data: IUser) => ({ ...data })"
    :create-fn="createUser"
    :delete-fn="deleteUser"
    :get-fn="getUser"
    :update-fn="updateUser"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-users' })"
  >
    <template #default="{ loading, submit }">
      <RouterView
        :loading="loading"
        :model="model"
        @submit="submit"
      />
    </template>
  </EGenericIdView>
</template>

<route lang="yaml">
path: /usuarios/:id
</route>
