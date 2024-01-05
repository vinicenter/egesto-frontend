<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getAllPricesTable, generatePriceTableReportById } from '../../datasource/pricesTable';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { downloadBlob } from '@/src/core/utils/utils';
import { IPricesTable } from '../../types/pricesTable';

const router = useRouter();
const notify = useNotify();

const columns = [
  {
    label: 'Nome',
    style: 'width: 200px',
    orderByValue: 'name',
    defaultOrderByValue: true
  },
]

const reportId = ref<string>('');
const reportLoading = ref(false);

const generateReport = async (item: IPricesTable.Root) => {
  try {
    reportLoading.value = true;
    reportId.value = item._id;

    const csvBlob = await generatePriceTableReportById(item._id)

    downloadBlob(csvBlob, `Tabela ${item.name}`, 'csv');
  } catch {
    notify.displayMessage({
      type: 'error',
      message: 'Erro ao gerar relatório',
    });
  } finally {
    reportLoading.value = false;
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
    :list-data-source="getAllPricesTable"
    query-key="pricesTable"
    @new="router.push({ name: 'price-table', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <div class="flex gap-x-sm justify-center items-center">
        <VBtn
          color="primary"
          :loading="reportLoading && reportId === item._id"
          @click="generateReport(item)"
        >
          Relatório
        </VBtn>

        <ETableActionButtons
          :id="item._id"
          delete
          edit
          clone
          page="price-table"
        />
      </div>
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-prices-table
meta:
  title: Tabelas de Preços
</route>
