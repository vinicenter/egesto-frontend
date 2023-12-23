<script lang="ts" setup>
import { createPerson, deletePerson, getPerson, updatePerson } from '../../datasource/people';

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getPerson"
    :delete-fn="deletePerson"
    :create-fn="createPerson"
    :update-fn="updatePerson"
    :redirect-to="{ name: 'list-people' }"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <PersonForm
        :initialValues="data"
        :button-label="buttonLabel"
        :loading="loadingSubmit"
        :disabled="type === 'deletar'"
        @submit="submit"
      />
    </template>
  </EGenericIdForm>
</template>

<route lang="yaml">
name: person
path: /pessoas/:id/:type
meta:
  title: Pessoa
</route>
