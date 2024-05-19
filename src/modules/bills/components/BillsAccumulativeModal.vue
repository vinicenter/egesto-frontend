<script setup lang="ts">
import { getCumulativeBills } from '@/src/modules/bills/datasource/bills';
import { required } from '@/src/core/utils/form-validator';
import { useQuery } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { reactive } from 'vue';
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { priceFormat } from '@/src/core/utils/format';
import { useBillsFilterStore } from '../stores/use-bills-filter-store';
import { BillPaymentMethods, IBillFilters } from '../types/bill';
import { BILL_PAYMENT_METHOD } from '../constants/bills';

const modelValue = defineModel<boolean>()

interface FormValues {
  startDate: Dayjs
  endDate: Dayjs
  isPaid: boolean | string
  tags: []
  paymentMethod: BillPaymentMethods[] | undefined
  recipient: string | undefined
}

const form = useForm<FormValues>({
  keepValuesOnUnmount: true,
  initialValues: {
    isPaid: 'undefined',
  }
})

interface CumulativeFilters extends IBillFilters {
  startDate: string
  endDate: string
}

const queryVariables = reactive<CumulativeFilters>({
  startDate: '',
  endDate: '',
  isPaid: 'undefined',
  tags: [],
  paymentMethod: undefined,
  recipient: undefined,
})

const billsFilterStore = useBillsFilterStore()

const setDayToFilter = (date: string) => {
  const dueDate = dayjs(date).toISOString()

  billsFilterStore.form?.setValues({
    dateFilterType: 'day',
    dueDate,
    dueMonth: undefined,
    dueYear: undefined,
    endDueDate: undefined,
    isPaid: queryVariables.isPaid,
    recipient: queryVariables.recipient,
    startDueDate: undefined,
    paymentMethod: queryVariables.paymentMethod,
    tags: queryVariables.tags,
  })

  const submit = billsFilterStore.submit()

  submit && submit()

  modelValue.value = false
}

const isQueryEnabled = computed(() => !!queryVariables.startDate && !!queryVariables.endDate)

const {
  data,
  isLoading,
} = useQuery({
  queryKey: [ 'bills-cumulative', queryVariables ],
  queryFn: () => getCumulativeBills(queryVariables),
  enabled: isQueryEnabled,
})

const submit = form.handleSubmit(async (values) => {
  queryVariables.endDate = values.endDate.toISOString()
  queryVariables.startDate = values.startDate.toISOString()
  queryVariables.isPaid = values.isPaid
  queryVariables.tags = values.tags
  queryVariables.paymentMethod = values.paymentMethod
  queryVariables.recipient = values.recipient
})

const isPaidEnabled = computed(() => queryVariables.isPaid === 'undefined' || queryVariables.isPaid === true)
const isUnpaidEnabled = computed(() => queryVariables.isPaid === 'undefined' || queryVariables.isPaid === false)

const tableHeaders = computed(() => [
  {
    title: 'Vencimento',
    value: 'date'
  },
  {
    title: 'Qtd de Contas',
    value: 'totalBills'
  },
  isPaidEnabled.value ? {
    title: 'Pago',
    value: 'paid'
  } : undefined,
  isUnpaidEnabled.value ? {
    title: 'Não pago',
    value: 'unpaid'
  } : undefined,
  isPaidEnabled.value ? {
    title: 'Acumulado pago',
    value: 'accumulativePaid'
  } : undefined,
  isUnpaidEnabled.value ? {
    title: 'Acumulado não pago',
    value: 'accumulativeUnpaid'
  } : undefined,
].filter((value) => !!value) as { title: string, value: string }[])

const rows = computed(() => {
  if(!data.value) {
    return []
  }

  const dataEntries = Object.entries(data.value)

  return dataEntries.reduce<{
    date: string
    totalBills: number
    paid: number
    unpaid: number
    accumulativePaid: number
    accumulativeUnpaid: number
  }[]>((acc, curr) => {
    const [ date, bills ] = curr

    acc.push({
      date,
      totalBills: bills.totalBills,
      paid: bills.paid,
      unpaid: bills.unpaid,
      accumulativePaid: bills.accumulativePaid,
      accumulativeUnpaid: bills.accumulativeUnpaid,
    })

    return acc
  }, [])
})

const { formatPrice } = priceFormat({
  minimumFractionDigits: 2
});
</script>

<template>
  <VDialog
    v-model="modelValue"
    width="800"
    close-on-back
  >
    <VCard>
      <VToolbar
        dark
        color="primary"
        title="Relatório cumulativo de contas"
      >
        <VBtn
          icon
          dark
          @click="modelValue = false"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <div class="p-sm space-y-sm">
        <form @submit.prevent="submit" class="space-y-sm">
          <div>Selecione o período</div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-sm">
            <EDatePicker
              name="startDate"
              label="Data inicial"
              :rules="required"
              :max-date="form.values.endDate"
            />

            <EDatePicker
              name="endDate"
              label="Data final"
              :rules="required"
              :min-date="form.values.startDate"
            />

            <ESelect
              label="Status"
              item-title="label"
              item-value="value"
              name="isPaid"
              :rules="required"
              :clearable="false"
              :items="[
                { label: 'Pago', value: true },
                { label: 'Não pago', value: false },
                { label: 'Ambos', value: 'undefined' },
              ]"
            />

            <BillTagsSelect
              name="tags" 
            />

            <ESelectPeople
              label="Recebedor"
              name="recipient"
            />

            <ESelect
              :items="BILL_PAYMENT_METHOD"
              :return-object="false"
              item-title="label"
              item-value="value"
              label="Forma de pagamento"
              name="paymentMethod"
              clearable
              multiple
            />
          </div>

          <VBtn color="primary" type="submit">
            Gerar relatório
          </VBtn>
        </form>

        <VDataTable
          :headers="tableHeaders"
          :items="rows"
          :loading="isLoading && isQueryEnabled"
          density="compact"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <div
                  class="cursor-pointer underline text-blue-800"
                  @click="setDayToFilter(item.date)"
                >
                  {{ dayjs(item.date).format('DD/MM/YYYY') }}
                </div>
              </td>
              <td>{{ item.totalBills }}</td>
              <td v-if="isPaidEnabled">{{ formatPrice(item.paid) }}</td>
              <td v-if="isUnpaidEnabled">{{ formatPrice(item.unpaid) }}</td>
              <td v-if="isPaidEnabled">{{ formatPrice(item.accumulativePaid) }}</td>
              <td v-if="isUnpaidEnabled">{{ formatPrice(item.accumulativeUnpaid) }}</td>
            </tr>
          </template>
        </VDataTable>
      </div>
    </VCard>
  </VDialog>
</template>
