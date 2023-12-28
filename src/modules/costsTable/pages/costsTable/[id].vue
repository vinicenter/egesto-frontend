<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createCostsTable, deleteCostsTable, getCostsTable, updateCostsTable } from '../../datasource/costsTable';
import { ICostsTable } from '../../types/costsTable';

const router = useRouter();

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const initialValues = {
  name: '',
  defaultShipmentCost: undefined,
  shipments: {
    families: [],
    products: [],
  },
  taxes: [],
  updatedAt: '',
  createdAt: '',
}

const formatSubmit = (data: ICostsTable.Root) => {
  return {
    name: data.name,
    defaultShipmentCost: Number(data.defaultShipmentCost),
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
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getCostsTable"
    :delete-fn="deleteCostsTable"
    :create-fn="createCostsTable"
    :update-fn="updateCostsTable"
    :format-submit-fn="formatSubmit"
    :initial-values-create="initialValues"
    @finish="router.push({ name: 'list-costs-table' })"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <CostsTableForm
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
name: cost-table
path: /tabelas-de-custos/:id/:type
meta:
  title: Tabela de Custo
</route>
