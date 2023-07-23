<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createProduct, deleteProduct, getProduct, updateProduct } from '../../datasource/products';
import { IProduct } from '../../types/product'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive({
})

const loadModel = (data: IProduct.Root) => {
  return {
    brand: data.brand?._id,
    family: data.family?._id,
  }
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="(data: IProduct.Root) => ({ ...data })"
    :create-fn="createProduct"
    :delete-fn="deleteProduct"
    :get-fn="getProduct"
    :update-fn="updateProduct"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-products' })"
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
path: /produtos/:id
</route>
