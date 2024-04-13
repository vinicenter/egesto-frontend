<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createPerson, deletePerson, getPerson, updatePerson } from '../../datasource/people';
import { IPeople } from '../../types/people';
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter();

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()

const formatSubmit = (data: IPeople): IPeople => ({
  ...data,
  contractExpenses: Number(data.contractExpenses) || 0
});

const queryClient = useQueryClient()

const finish = () => {
  queryClient.invalidateQueries(['people'])
  router.push({ name: 'list-people' })
}

const initialValuesCreate = {}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getPerson"
    :delete-fn="deletePerson"
    :create-fn="createPerson"
    :update-fn="updatePerson"
    :format-submit-fn="formatSubmit"
    :initial-values-create="initialValuesCreate"
    @finish="finish"
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
