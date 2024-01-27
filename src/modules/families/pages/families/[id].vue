<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createFamily, deleteFamily, getFamily, updateFamily } from '../../datasource/families'
import { IFamily } from '../../types/family'
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter();

const props = defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const initialValues = {
  name: '',
  costs: [],
  linkedFamily: undefined
}

const formatSubmit = async (data: IFamily) => {
  const isSelectUndefined = (props.type === 'criar' || props.type === 'clonar')

  const linkedFamily = isSelectUndefined
    ? data.linkedFamily?._id ? data.linkedFamily?._id : undefined
    : data.linkedFamily?._id ? data.linkedFamily._id : null

  return {
    name: data.name,
    costs: data.costs.map((cost) => {
      return {
        name: cost.name,
        value: Number(cost.value)
      }
    }),
    linkedFamily,
  }
}

const queryClient = useQueryClient()

const finish = () => {
  queryClient.invalidateQueries(['families'])
  router.push({ name: 'list-families' })
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
    @finish="finish"
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
