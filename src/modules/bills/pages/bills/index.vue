<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

import { getbills } from '../../datasource/bills';
import { priceFormat } from '@/src/core/utils/format';
import dayjs from '~utils/dayjs'
import BillFilter from '../../components/BillFilter.vue';
import { ref } from 'vue';
import { IBill, IBillFilters } from '../../types/bill';
import BillPayOrRevertPaid from '../../components/BillPayOrRevertPaid.vue';

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

const queryVariables = ref<Partial<IBillFilters>>({
  isPaid: false,
})

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

const formatType = (type: IBill['type']) => {
  const options: Record<IBill['type'], string> = {
    BOLETO: 'Boleto',
    CHEQUE: 'Cheque',
    DINHEIRO: 'Dinheiro',
    PIX: 'Pix',
    TRANSFERENCIA_BANCARIA: 'Transferência bancária',
  }

  return options[type]
}
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getbills"
    query-key="bills"
    :queryVariables="queryVariables"
    @new="router.push({ name: 'bill', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>
        <div>Vencimento: {{ dayjs(item.dueDate).format('DD/MM/YYYY') }}</div>
        <div>{{ formatPrice(item.amount) }}</div>
        <div>{{ formatType(item.type) }}</div>
        <div>
          <VIcon icon="mdi-square-rounded" :class="formatStatusColor(item.dueDate, item.isPaid)" />
          {{ formatStatus(item.dueDate, item.isPaid) }}
        </div>
      </td>
      <td>{{ item.recipient ? item.recipient.corporateName : '-' }}</td>
      <td>{{ item.reference || '-' }}</td>
      <td>{{ item.observations || '-' }}</td>
    </template>

    <template #menu>
      <BillFilter
        :initial-values="queryVariables"
        @update="queryVariables = $event"
      />
    </template>

    <template #actions="{ item }">
      <div class="flex gap-x-sm justify-center items-center">
        <BillPayOrRevertPaid :item="item" />

        <ETableActionButtons
          :id="item._id"
          delete
          edit
          :clone="false"
          page="bill"
        />
      </div>
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-bills
meta:
  title: Contas
</route>