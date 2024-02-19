<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { createFamily, deleteFamily, getFamily, updateFamily } from '../../datasource/families'
import { IFamily } from '../../types/family'
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter();
const route = useRoute();

const props = defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const initialValues = {
  name: '',
  costs: [],
  linkedFamily: route.query.mainFamilyId && route.query.mainFamilyName && {
    _id: route.query.mainFamilyId,
    name: route.query.mainFamilyName,
  },
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

const finish = (values: any) => {
  queryClient.invalidateQueries(['families'])

  goToListing(!!values.linkedFamily, {
    id: values.linkedFamily?._id,
    name: values.linkedFamily?.name
  })
}

const goToListing = (isSubFamily: boolean, mainFamily?: { id: number, name: string }) => {
  router.push({
    name: 'list-families',
    query: (isSubFamily && mainFamily) ? {
      subFamilyModal: 'true',
      mainFamilyId: mainFamily.id,
      mainFamilyName: mainFamily.name
    } : {}
  })
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
        :id="id"
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
