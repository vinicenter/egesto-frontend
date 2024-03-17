<script setup lang="ts">
import { getCumulativeBills } from '@/src/modules/bills/datasource/bills';
import { required } from '@/src/core/utils/form-validator';
import { useQuery } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { reactive } from 'vue';
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { priceFormat } from '@/src/core/utils/format';

const modelValue = defineModel<boolean>()

const form = useForm<{
  startDate: Dayjs
  endDate: Dayjs
}>({
  keepValuesOnUnmount: true,
})

const queryVariables = reactive({
  startDate: '',
  endDate: '',
})

const isQueryEnabled = computed(() => !!queryVariables.startDate && !!queryVariables.endDate)

const {
  data,
  isLoading,
} = useQuery({
  queryKey: [ 'cumulative-bills', queryVariables ],
  queryFn: () => getCumulativeBills(queryVariables),
  enabled: isQueryEnabled,
})

const submit = form.handleSubmit(async (values) => {
  queryVariables.endDate = values.endDate.toISOString()
  queryVariables.startDate = values.startDate.toISOString()
})

const tableHeaders = [
  {
    title: 'Vencimento',
    value: 'date'
  },
  {
    title: 'Qtd de Contas',
    value: 'totalBills'
  },
  {
    title: 'Pago',
    value: 'paid'
  },
  {
    title: 'Não pago',
    value: 'unpaid'
  },
  {
    title: 'Acumulado pago',
    value: 'accumulativePaid'
  },
  {
    title: 'Acumulado não pago',
    value: 'accumulativeUnpaid'
  },
]

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
        <form @submit.prevent="submit" class="space-y-4px">
          <div>Selecione o período</div>

          <div class="flex flex-col gap-sm sm:flex-row">
            <div class="w-400px">
              <EDatePicker
                name="startDate"
                label="Data inicial"
                :rules="required"
                :max-date="form.values.endDate"
              />
            </div>

            <div class="w-400px">
              <EDatePicker
                name="endDate"
                label="Data final"
                :rules="required"
                :min-date="form.values.startDate"
              />
            </div>
          </div>

          <VBtn color="primary" type="submit">
            Gerar relatório
          </VBtn>
        </form>

        <VDataTable
          :headers="tableHeaders"
          :items="rows"
          :loading="isLoading && isQueryEnabled"
          loading-text="Carregando relatório"
          :hide-default-footer="true"
          density="compact"
          no-data-text="Preencha um período para ver resultados."
          itemsPerPageText="Itens por página"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ dayjs(item.date).format('DD/MM/YYYY') }}</td>
              <td>{{ item.totalBills }}</td>
              <td>{{ formatPrice(item.paid) }}</td>
              <td>{{ formatPrice(item.unpaid) }}</td>
              <td>{{ formatPrice(item.accumulativePaid) }}</td>
              <td>{{ formatPrice(item.accumulativeUnpaid) }}</td>
            </tr>
          </template>
        </VDataTable>
      </div>
    </VCard>
  </VDialog>
</template>
