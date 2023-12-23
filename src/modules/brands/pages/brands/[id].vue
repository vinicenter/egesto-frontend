<script lang="ts" setup>
import { createBrand, getBrand, deleteBrand, updateBrand } from '../../datasource/brands';

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getBrand"
    :delete-fn="deleteBrand"
    :create-fn="createBrand"
    :update-fn="updateBrand"
    :redirect-to="{ name: 'list-brands' }"
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
