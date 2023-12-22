<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createPricesTable, deletePricesTable, getPricesTable, updatePricesTable } from '../../datasource/pricesTable';
import { IPricesTable } from '../../types/pricesTable'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive<IPricesTable.Root>({
  name: '',
  archived: false,
  costTable: undefined,
  customer: undefined,
  prices: []
})

const loadModel = (data: IPricesTable.Root) => {
  model.name = data.name;
  model.archived = data.archived;
  model.costTable = data.costTable;
  model.customer = data.customer;
  model.prices = data.prices || [];
}

const formatSubmit = (data: IPricesTable.Root) => {
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
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="formatSubmit"
    :create-fn="createPricesTable"
    :delete-fn="deletePricesTable"
    :get-fn="getPricesTable"
    :update-fn="updatePricesTable"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-prices-table' })"
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
path: /tabelas-de-precos/:id
</route>
