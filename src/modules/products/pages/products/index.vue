<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getProducts } from '../../datasource/products';
import { ref } from 'vue';
import { priceFormat } from '@/src/core/utils/format';

const router = useRouter();
const { formatPrice } = priceFormat();

const columns = [
  { label: 'Código', style: 'width: 100px', orderByValue: 'code' },
  { label: 'Nome', style: 'width: 200px', orderByValue: 'name', defaultOrderByValue: true },
  { label: 'Família', style: 'width: 100px' },
  { label: 'Unidade por Pack', style: 'width: 100px' },
  { label: 'Custo unitário', style: 'width: 100px' },
  { label: 'Custo total', style: 'width: 100px' },
]

const viewId = ref(null)

const closeView = (open = false) => {
  if(!open) {
    viewId.value = null
  }
}
</script>

<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getProducts"
    query-key="products"
    @new="router.push({ name: 'product', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.code || '-' }}</td>
      <td>{{ item.name || '-' }}</td>
      <td>{{ item.family?.name || '-' }}</td>
      <td>{{ item.pack?.numberOfUnitsInPack || '-' }}</td>
      <td>{{ item.productionCost?.unitCost ? formatPrice(item.productionCost?.unitCost) : '-' }}</td>
      <td>{{ item.productionCost?.packCost ? formatPrice(item.productionCost?.packCost) : '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        clone
        view
        page="product"
        @view="viewId = $event"
      />
    </template>
  </ETableGenericList>

  <ProductDetailsModel
    :model-value="!!viewId"
    :id="viewId"
    @update:model-value="closeView"
  />
</template>

<route lang="yaml">
name: list-products
meta:
  title: Produtos
</route>
