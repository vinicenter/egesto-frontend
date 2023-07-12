<script lang="ts" setup>
import { useRouter } from 'vue-router';
import EGenericIdView from '../../../../../core/components/EGeneric/EGenericIdView.vue'
import { createFeedStock, deleteFeedStock, getFeedStock, updateFeedStock } from '../../datasource/feedstocks'
import { reactive } from 'vue';
import { IFeedstock } from '../../types/feedstocks'

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive<IFeedstock>({
  name: '',
  price: 0,
  icms: 0,
  priceWithoutIcms: 0,
  brand: undefined,
  ncm: '',
})

const loadModel = (data: IFeedstock) => {
  model.name = data.name;
  model.price = data.price;
  model.icms = data.icms;
  model.priceWithoutIcms = data.priceWithoutIcms;
  model.brand = data.brand;
  model.ncm = data.ncm;
}

const formatSubmitFeedStock = async (data: IFeedstock) => {
  return {
    name: data.name,
    price: Number(data.price),
    icms: Number(data.icms),
    ncm: data.ncm,
    brand: data.brand?._id,
  }
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :create-fn="createFeedStock"
    :delete-fn="deleteFeedStock"
    :get-fn="getFeedStock"
    :update-fn="updateFeedStock"
    :format-submit-fn="formatSubmitFeedStock"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-feedstocks' })"
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
path: /materias-primas/:id
</route>
