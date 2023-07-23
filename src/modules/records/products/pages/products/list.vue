<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getProducts } from '../../datasource/products';
import { ref } from 'vue';

const router = useRouter();

const columns = [
  { label: 'Código', style: 'width: 100px' },
  { label: 'Nome', style: 'width: 200px' },
  { label: 'Família', style: 'width: 100px' },
  { label: 'Marca', style: 'width: 100px' },
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
    @new="router.push({ name: 'create-products', params: { id: 'novo' } })"
  >
    <template #default="{ item }">
      <td>{{ item.code || '-' }}</td>
      <td>{{ item.name || '-' }}</td>
      <td>{{ item.family?.name || '-' }}</td>
      <td>{{ item.brand?.name || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        clone
        view
        page="people"
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
path: listar
meta:
  title: Produtos
</route>
