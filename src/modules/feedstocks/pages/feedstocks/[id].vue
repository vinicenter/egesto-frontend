<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createFeedStock, deleteFeedStock, getFeedStock, updateFeedStock } from '../../datasource/feedstocks'
import { IFeedstock } from '../../types/feedstocks';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const router = useRouter()

const formatSubmitFeedStock = async (data: IFeedstock) => {
  const isSelectUndefined = (props.type === 'criar' || props.type === 'clonar')

  const brand = isSelectUndefined
    ? data.brand?._id ? data.brand._id : undefined
    : data.brand?._id ? data.brand._id : null 

  return {
    name: data.name,
    price: Number(data.price),
    icms: Number(data.icms),
    ncm: data.ncm,
    brand: brand,
  }
}

const initialValuesCreate = {
  name: '',
  price: '',
  icms: '',
  ncm: '',
  brand: null,
}


const queryClient = useQueryClient()

const finish = () => {
  queryClient.invalidateQueries(['feedstocks'])
  router.push({ name: 'list-feedstocks' })
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getFeedStock"
    :delete-fn="deleteFeedStock"
    :create-fn="createFeedStock"
    :update-fn="updateFeedStock"
    :format-submit-fn="formatSubmitFeedStock"
    :initial-values-create="initialValuesCreate"
    @finish="finish"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <FeedStockForm
        :initialValues="data"
        :button-label="buttonLabel"
        :disabled="type === 'deletar'"
        :loading="loadingSubmit"
        @submit="submit"
      />
    </template>
  </EGenericIdForm>
</template>

<route lang="yaml">
name: feedstock
path: /materias-primas/:id/:type
meta:
  title: Matéria Prima
</route>
