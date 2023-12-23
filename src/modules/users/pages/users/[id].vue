<script lang="ts" setup>
import { createUser, getUser, deleteUser, updateUser } from '../../datasource/auth';

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getUser"
    :delete-fn="deleteUser"
    :create-fn="createUser"
    :update-fn="updateUser"
    :redirect-to="{ name: 'list-users' }"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <UserForm
        :initialValues="data"
        :button-label="buttonLabel"
        :password-required="id === 'novo'"
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
