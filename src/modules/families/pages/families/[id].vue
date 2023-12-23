<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createFamily, deleteFamily, getFamily, updateFamily } from '../../datasource/families'
import { IFamily } from '../../types/family'

const router = useRouter();

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()

const initialValues = {
  name: '',
  costs: []
}

const formatSubmit = async (data: IFamily) => {
  return {
    name: data.name,
    costs: data.costs.map((cost) => {
      return {
        name: cost.name,
        value: Number(cost.value)
      }
    }),
  }
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getFamily"
    :delete-fn="deleteFamily"
    :create-fn="createFamily"
    :update-fn="updateFamily"
    :format-submit-fn="formatSubmit"
    :initial-values-create="initialValues"
    @finish="router.push({ name: 'list-families' })"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <FamiliesForm
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
name: family
path: /familias/:id/:type
meta:
  title: Família
</route>
