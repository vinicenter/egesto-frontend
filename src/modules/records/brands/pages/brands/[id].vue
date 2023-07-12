<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createBrand, getBrand, deleteBrand, updateBrand } from '../../datasource/brands';
import { IBrand } from '../../types/brand'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive({
  name: '',
  description: '',
})

const loadModel = (data: IBrand) => {
  model.name = data.name;
  model.description = data.description;
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="(data: IBrand) => ({ ...data })"
    :create-fn="createBrand"
    :delete-fn="deleteBrand"
    :get-fn="getBrand"
    :update-fn="updateBrand"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-brands' })"
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
path: /marcas/:id
</route>
