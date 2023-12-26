<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createUser, getUser, deleteUser, updateUser } from '../../datasource/auth';
import { IUser } from '../../types/auth';
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter()

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()

const queryClient = useQueryClient()

const initialValues: IUser = {
  name: '',
  username: '',
  email: '',
  password: undefined,
}

const finish = () => {
  router.push({ name: 'list-users' })
  queryClient.invalidateQueries([ 'users' ])
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getUser"
    :delete-fn="deleteUser"
    :create-fn="createUser"
    :update-fn="updateUser"
    :initialValuesCreate="initialValues"
    :format-submit-fn="(data: IUser) => ({ ...data })"
    @finish="finish"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <UserForm
        :initialValues="data"
        :button-label="buttonLabel"
        :password-required="id === 'novo'"
        :disabled="type === 'deletar'"
        :loading="loadingSubmit"
        @submit="submit"
      />
    </template>
  </EGenericIdForm>
</template>

<route lang="yaml">
name: user
path: /usuarios/:id/:type
meta:
  title: Usuário
</route>
