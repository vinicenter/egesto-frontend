<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createBrand, getBrand, deleteBrand, updateBrand } from '../../datasource/brands';
import { IBrand } from '../../types/brand';

const router = useRouter()

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()

const initialValuesCreate = {
  name: '',
  description: '',
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getBrand"
    :delete-fn="deleteBrand"
    :create-fn="createBrand"
    :update-fn="updateBrand"
    :initial-values-create="initialValuesCreate"
    :formatSubmitFn="(data: IBrand) => ({ ...data })"
    @finish="router.push({ name: 'list-brands' })"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <BrandForm
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
name: brand
path: /marcas/:id/:type
meta:
  title: Marca
</route>
