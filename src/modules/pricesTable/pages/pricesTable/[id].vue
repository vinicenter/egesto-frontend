<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createPricesTable, deletePricesTable, getPricesTable, updatePricesTable } from '../../datasource/pricesTable';
import { IPricesTable, PricesTableFormType } from '../../types/pricesTable'
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter()

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' }>()

const initialValues = {
  name: '',
  archived: false,
  costTable: undefined,
  customer: undefined,
  prices: []
}

const formatSubmit = (data: PricesTableFormType.Root) => {
  return {
    name: data.name,
    archived: data.archived,
    costTable: data.costTable?._id,
    customer: data.customer?._id,
    prices: data.prices.map((price) => ({
      product: price.product._id,
      tax: Number(price.tax),
      shipment: Number(price.shipment),
      expense: Number(price.expense),
      price: Number(price.price),
      volume: Number(price.volume),
      grossRevenue: Number(price.grossRevenue),
      netSales: Number(price.netSales),
      productCost: Number(price.productCost),
      productionLost: Number(price.productionLost),
      margin: Number(price.margin),
    }))
  }
}

const formatInitialValues = (data: IPricesTable.Root): PricesTableFormType.Root => {
  return {
    archived: data.archived,
    name: data.name,
    _id: data._id,
    costTable: data.costTable,
    customer: data.customer,
    prices: data.prices,
  }
}

const queryClient = useQueryClient()

const finish = () => {
  queryClient.invalidateQueries(['pricesTable'])
  router.push({ name: 'list-prices-table' })
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getPricesTable"
    :delete-fn="deletePricesTable"
    :create-fn="createPricesTable"
    :update-fn="updatePricesTable"
    :format-submit-fn="formatSubmit"
    :initial-values-create="initialValues"
    :format-initial-values="formatInitialValues"
    @finish="finish"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <PricesTableForm
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
name: price-table
path: /tabelas-de-precos/:id/:type
meta:
  title: Tabela de preço
</route>
