<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getFeedStocks } from '../../datasource/feedstocks';
import { priceFormat } from '~utils/format';

const router = useRouter();

const { format } = priceFormat();

const columns = [
  { label: 'Nome', style: 'width: 200px' },
  { label: 'Preço', style: 'width: 100px' },
  { label: 'ICMS', style: 'width: 100px' },
  { label: 'Preço Sem ICMS', style: 'width: 100px' },
  { label: 'Marca', style: 'width: 100px' },
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getFeedStocks"
    query-key="feedstocks"
    @new="router.push({ name: 'create-feedstocks', params: { id: 'novo' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
      <td>{{ format(item.price) || '-' }}</td>
      <td>{{ item.icms ? `${item.icms}%` : '-' }}</td>
      <td>{{ format(item.priceWithoutIcms) || '-' }}</td>
      <td>{{ item.brand?.name || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="feedstocks"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-feedstocks
path: listar
meta:
  title: Matérias Primas
</route>
