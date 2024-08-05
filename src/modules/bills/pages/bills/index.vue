<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

import { getBills, exportBills } from '../../datasource/bills';
import { priceFormat } from '@/src/core/utils/format';
import dayjs from '~utils/dayjs'
import BillFilter from '../../components/BillFilter.vue';
import { ref } from 'vue';
import { IBill } from '../../types/bill';
import BillPayOrRevertPaid from '../../components/BillPayOrRevertPaid.vue';
import { downloadBlob } from '@/src/core/utils/utils';
import useNotify from '@/src/core/composables/useNotify';
import { useBillsFilterStore } from '../../stores/use-bills-filter-store';

const { formatPrice } = priceFormat({
  minimumFractionDigits: 2,
})

const columns = [
  {
    label: 'Informações',
    orderLabel: 'Vencimento',
    style: 'width: 300px',
    defaultOrderByValue: true,
    orderByValue: 'dueDate'
  },
  {
    label: 'Recebedor',
    style: 'width: 200px',
  },
  {
    label: 'Referência',
    style: 'width: 200px',
  },
  {
    label: 'Observações',
    style: 'width: 200px',
  },
]

defineOptions({
  name: 'BillsList'
})

const billsFilterStore = useBillsFilterStore()
billsFilterStore.resetQueryVariables()

const formatStatus = (dueDate: string, isPaid: boolean) => {
  if(isPaid) return 'Pago'

  const today = dayjs()

  const isDue = dayjs(dueDate).isBefore(today)
  const goingToDueToday = dayjs(dueDate).isSame(today, 'day')

  if(goingToDueToday) return 'Vence hoje'

  return isDue
    ? 'Vencido ' + dayjs(dueDate).add(1, 'day').fromNow()
    : 'Vence ' + dayjs(dueDate).add(1, 'day').fromNow()
}

const formatStatusColor = (dueDate: string, isPaid: boolean) => {
  if(isPaid) return 'text-green-500'

  const today = dayjs()

  const isDue = dayjs(dueDate).isBefore(today)
  const goingToDueToday = dayjs(dueDate).isSame(today, 'day')

  if(goingToDueToday) return 'text-yellow-500'

  return isDue
    ? 'text-red-500'
    : 'text-blue-500'
}

const formatPaymentMethod = (paymentMethod: IBill['paymentMethod']) => {
  const options: Record<IBill['paymentMethod'], string> = {
    BOLETO: 'Boleto',
    CHEQUE: 'Cheque',
    DINHEIRO: 'Dinheiro',
    PIX: 'Pix',
    TRANSFERENCIA_BANCARIA: 'Transferência bancária',
  }

  return options[paymentMethod]
}

const notify = useNotify();

const exportLoading = ref(false);
const generateExport = async (shouldUseFilter: boolean) => {
  try {
    exportLoading.value = true;

    const params = shouldUseFilter
      ? billsFilterStore.queryVariables
      : { isPaid: 'undefined' }

    const csvBlob = await exportBills(params)

    downloadBlob(csvBlob, `Relatório Contas`, 'csv');
  } catch (e) {
    notify.displayMessage({
      type: 'error',
      message: 'Erro ao exportar',
    });
  } finally {
    exportLoading.value = false;
  }
}

const openAccumulativeModal = ref(false);
const openDailyReportModal = ref(false);
</script>

<template>
  <div class="space-y-sm">
    <BillsSummary />

    <ETableGenericList
      :columns="columns"
      :list-data-source="getBills"
      query-key="bills"
      :queryVariables="billsFilterStore.queryVariables"
    >
      <template #default="{ item }">
        <td>
          <div v-if="item?.installment">
            Parcelamento: {{ item?.installment?.name }}
          </div>
          <div>Vencimento: {{ dayjs(item.dueDate).format('DD/MM/YYYY') }}</div>
          <div>{{ formatPrice(item.amount) }}</div>
          <div>{{ formatPaymentMethod(item.paymentMethod) }}</div>
          <div>
            <VIcon icon="mdi-square-rounded" :class="formatStatusColor(item.dueDate, item.isPaid)" />
            {{ formatStatus(item.dueDate, item.isPaid) }}
          </div>
          <BillTableTags
            v-if="item.tags && item.tags.length"
            :tags="item.tags"
          />
        </td>
        <td>{{ item.recipient ? item.recipient.corporateName : '-' }}</td>
        <td>{{ item.reference || '-' }}</td>
        <td>{{ item.observations || '-' }}</td>
      </template>

      <template #new>
        <VMenu>
          <template v-slot:activator="{ props }">
            <VBtn
              color="primary"
              append-icon="mdi-menu-down"
              v-bind="props"
            >
              Novo
            </VBtn>
          </template>

          <VList>
            <VListItem
              title="Nova Conta"
              @click="router.push({ name: 'bill', params: { id: 'novo', type: 'criar' } })"
            />

            <VListItem
              title="Novo Parcelamento"
              @click="router.push({ name: 'bill-installment', params: { id: 'novo', type: 'criar' } })"
            />
          </VList>
        </VMenu>
      </template>
      <template #menu>

        <VMenu>
          <template v-slot:activator="{ props }">
            <VBtn
              v-bind="props"
              color="purple"
              :loading="exportLoading"
            >
              Relatórios
            </VBtn>
          </template>

          <VList>
            <VListItem @click="openDailyReportModal = true">
              <VListItemTitle>Relatório diário</VListItemTitle>
            </VListItem>

            <VListItem @click="openAccumulativeModal = true">
              <VListItemTitle>Relatório acumulativo</VListItemTitle>
            </VListItem>

            <VListItem @click="generateExport(false)">
              <VListItemTitle>Exportar todos em CSV</VListItemTitle>
            </VListItem>

            <VListItem @click="generateExport(true)">
              <VListItemTitle>Exportar filtro atual em CSV</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>

        <BillFilter />
      </template>
      <template #actions="{ item }">
        <div class="flex gap-x-sm justify-center items-center">
          <BillPayOrRevertPaid :item="item" />
          <ETableActionButtons
            :id="item.installment ? item.installment._id : item._id"
            delete
            edit
            :clone="!item.installment"
            :page="item.installment ? 'bill-installment' : 'bill'"
          />
        </div>
      </template>
    </ETableGenericList>

    <BillsAccumulativeModal v-model="openAccumulativeModal" />
    <BillsDailyReportModal v-model="openDailyReportModal" />
  </div>
</template>

<route lang="yaml">
name: list-bills
meta:
  title: Contas
</route>
