<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createFeedStock, deleteFeedStock, getFeedStock, updateFeedStock } from '../../datasource/feedstocks'
import { IFeedstock } from '../../types/feedstocks';

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()

const router = useRouter()

const formatSubmitFeedStock = async (data: IFeedstock) => {
  return {
    name: data.name,
    price: Number(data.price),
    icms: Number(data.icms),
    ncm: data.ncm,
    brand: data.brand?._id ? data.brand._id : null,
  }
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
    @finish="router.push({ name: 'list-feedstocks' })"
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
