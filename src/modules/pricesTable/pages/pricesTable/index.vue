<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getAllPricesTable, generatePriceTableReportById } from '../../datasource/pricesTable';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { downloadBlob } from '@/src/core/utils/utils';
import { IPricesTable } from '../../types/pricesTable';
import { reactive } from 'vue';

const router = useRouter();
const notify = useNotify();

const columns = [
  {
    label: 'Nome',
    style: 'width: 200px',
    orderByValue: 'name',
    defaultOrderByValue: true
  },
  {
    label: 'Tabela de Custo',
    style: 'width: 200px',
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
      message: 'Erro ao exportar',
    });
  } finally {
    reportLoading.value = false;
  }
}

const queryVariables = reactive({
  archived: false,
})

defineOptions({
  name: 'PriceTableList',
  inheritAttrs: false,
})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getAllPricesTable"
    :query-variables="queryVariables"
    query-key="pricesTable"
    @new="router.push({ name: 'price-table', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
      <td>{{ item.costTable.name || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <div class="flex gap-x-sm justify-center items-center">
        <VBtn
          color="purple"
          :loading="reportLoading && reportId === item._id"
          @click="generateReport(item)"
        >
          Exportar em CSV
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

    <template #menu>
      <PricesTableFilters v-model="queryVariables" />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-prices-table
meta:
  title: Tabelas de Preços
</route>
