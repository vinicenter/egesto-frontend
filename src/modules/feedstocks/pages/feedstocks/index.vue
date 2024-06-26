<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getFeedStocks, updateFeedStock, generateFeedstockReport } from '../../datasource/feedstocks';
import { priceFormat } from '~utils/format';
import { useQueryClient } from '@tanstack/vue-query';
import { required } from '@/src/core/utils/form-validator';
import { downloadBlob } from '@/src/core/utils/utils';
import useNotify from '@/src/core/composables/useNotify';
import { ref } from 'vue';

const router = useRouter();
const queryClient = useQueryClient();
const notify = useNotify();

const { formatPrice } = priceFormat();

const columns = [
  {
    label: 'Nome',
    style: 'width: 250px',
    orderByValue: 'name',
    defaultOrderByValue: true,
  },
  {
    label: 'Preço',
    style: 'width: 100px',
    orderByValue: 'price',
    tooltip: 'Você pode editar este campo clicando sobre ele na tabela.',
  },
  {
    label: 'ICMS',
    style: 'width: 100px',
    orderByValue: 'icms',
    tooltip: 'Você pode editar este campo clicando sobre ele na tabela.'
  },
  {
    label: 'Preço Sem ICMS',
    style: 'width: 100px',
    tooltip: 'Este campo é processado automáticamente.'
  },
  {
    label: 'Marca',
    style: 'width: 100px'
  },
]

const updatePrice = async (id: string, price: Number) => {
  await updateFeedStock(id, { price: Number(price) });

  queryClient.invalidateQueries([ 'feedstocks' ]);
}

const updateIcms = async (id: string, icms: Number) => {
  await updateFeedStock(id, { icms: Number(icms) });

  queryClient.invalidateQueries([ 'feedstocks' ]);
}

const reportLoading = ref(false);

const generateReport = async () => {
  try {
    reportLoading.value = true;

    const csvBlob = await generateFeedstockReport()

    downloadBlob(csvBlob, `Relatório Materias Primas`, 'csv');
  } catch (e) {
    notify.displayMessage({
      type: 'error',
      message: 'Erro ao exportar',
    });
  } finally {
    reportLoading.value = false;
  }
}

defineOptions({
  name: 'FeedstocksList'
})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getFeedStocks"
    query-key="feedstocks"
    @new="router.push({ name: 'feedstock', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
      <td>
        <ETableCellUpdate
          :label="formatPrice(item.price) || '-'"
          :initial-values="{ price: item.price }"
          @submit="updatePrice(item._id, $event.price)"
        >
          <template #content>
            <EInputPrice
              label="Preço"
              name="price"
              hide-details
              class="w-60"
              :rules="[required]"
            />
          </template>
        </ETableCellUpdate>
      </td>
      <td>
        <ETableCellUpdate
          :label="item.icms ? `${item.icms}%` : '-'"
          :initial-values="{ icms: item.icms }"
          @submit="updateIcms(item._id, $event.icms)"
        >
          <template #content>
            <EInputPct
              label="ICMS"
              name="icms"
              hide-details
              class="w-40"
              :rules="[required]"
            />
          </template>
        </ETableCellUpdate>
      </td>
      <td>{{ formatPrice(item.priceWithoutIcms) || '-' }}</td>
      <td>{{ item.brand?.name || '-' }}</td>
    </template>

    <template #menu>
      <VBtn
        color="purple"
        :loading="reportLoading"
        @click="generateReport"
      >
        Exportar todos em CSV
      </VBtn>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="feedstock"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-feedstocks
meta:
  title: Matérias Primas
</route>
