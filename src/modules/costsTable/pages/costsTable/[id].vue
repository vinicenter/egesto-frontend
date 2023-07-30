<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createCostsTable, deleteCostsTable, getCostsTable, updateCostsTable } from '../../datasource/costsTable';
import { ICostsTable } from '../../types/costsTable'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive<ICostsTable.Root>({
  name: '',
  shipments: {
    families: [],
    products: [],
  },
  taxes: [],
  updatedAt: '',
  createdAt: '',
})

const loadModel = (data: ICostsTable.Root) => {
  model.name = data.name;
  model.taxes = data.taxes;
  model.shipments = data.shipments;
}

const formatSubmit = (data: ICostsTable.Root) => {
  return {
    name: data.name,
    taxes: data.taxes.map(tax => ({
      name: tax.name,
      cost: Number(tax.cost),
    })),
    shipments: {
      families: data.shipments.families.map(family => ({
        family: family?.family?._id,
        cost: Number(family.cost),
      })),
      products: data.shipments.products.map(product => ({
        product: product?.product?._id,
        cost: Number(product.cost),
      })),
    }
  }
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="formatSubmit"
    :create-fn="createCostsTable"
    :delete-fn="deleteCostsTable"
    :get-fn="getCostsTable"
    :update-fn="updateCostsTable"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-costs-table' })"
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
path: /tabelas-de-custos/:id
</route>
