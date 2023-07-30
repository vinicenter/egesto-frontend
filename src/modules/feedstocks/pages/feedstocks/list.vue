<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getFeedStocks, updateFeedStock } from '../../datasource/feedstocks';
import { priceFormat } from '~utils/format';
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter();
const queryClient = useQueryClient();

const { formatPrice } = priceFormat();

const columns = [
  { label: 'Nome', style: 'width: 250px' },
  { label: 'Preço', style: 'width: 100px', tooltip: 'Você pode editar este campo clicando sobre ele na tabela.' },
  { label: 'ICMS', style: 'width: 100px', tooltip: 'Você pode editar este campo clicando sobre ele na tabela.' },
  { label: 'Preço Sem ICMS', style: 'width: 100px', tooltip: 'Este campo é processado automáticamente.' },
  { label: 'Marca', style: 'width: 100px' },
]

const updatePrice = async (id: string, price: Number) => {
  await updateFeedStock(id, { price: Number(price) });

  queryClient.invalidateQueries([ 'feedstocks' ]);
}

const updateIcms = async (id: string, icms: Number) => {
  await updateFeedStock(id, { icms: Number(icms) });

  queryClient.invalidateQueries([ 'feedstocks' ]);
}
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
      <td>
        <ETableCellUpdate
          :label="formatPrice(item.price) || '-'"
        >
          <template #content>
            <EInputPrice
              :model-value="item.price"
              hide-details
              class="w-60"
              @keyup.enter="updatePrice(item._id, $event.target.value)"
            />
          </template>
        </ETableCellUpdate>
      </td>
      <td>
        <ETableCellUpdate :label="item.icms ? `${item.icms}%` : '-'">
          <template #content>
            <EInputPct
              :model-value="item.icms"
              hide-details
              class="w-40"
              @keyup.enter="updateIcms(item._id, $event.target.value)"
            />
          </template>
        </ETableCellUpdate>
      </td>
      <td>{{ formatPrice(item.priceWithoutIcms) || '-' }}</td>
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
