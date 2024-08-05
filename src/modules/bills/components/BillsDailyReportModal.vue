<script setup lang="ts">
import { exportDailyReportBills, getDailyReportBills } from '@/src/modules/bills/datasource/bills';
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
import ESelectBillInstallments from '@/src/core/components/ESelect/ESelectBillInstallments.vue';
import { VDataTable, VEmptyState, VSkeletonLoader } from 'vuetify/lib/components/index.mjs';
import type { BillsFormFilter } from '../stores/use-bills-filter-store'
import useNotify from '@/src/core/composables/useNotify';
import { downloadBlob } from '@/src/core/utils/utils';
import { ref } from 'vue';

const modelValue = defineModel<boolean>()

interface FormValues {
  startDate: Dayjs
  endDate: Dayjs
  isPaid: boolean | string
  tags: []
  installment: string | undefined
  paymentMethod: BillPaymentMethods[] | undefined
  recipient: string | undefined
  tagsFilterType: 'OR' | 'AND'
}

const form = useForm<FormValues>({
  keepValuesOnUnmount: true,
  initialValues: {
    isPaid: 'undefined',
    tagsFilterType: 'OR',
  }
})

interface DailyReportFilters extends IBillFilters {
  startDate: string
  endDate: string
}

const queryVariables = reactive<DailyReportFilters>({
  startDate: '',
  endDate: '',
  isPaid: 'undefined',
  tags: [],
  paymentMethod: undefined,
  recipient: undefined,
})

const billsFilterStore = useBillsFilterStore()

const setListingFilter = (partialFilter?: Partial<BillsFormFilter>) => {

  billsFilterStore.form?.setValues({
    dateFilterType: 'no-period',
    endDueDate: queryVariables.endDate,
    isPaid: queryVariables.isPaid,
    recipient: queryVariables.recipient,
    installment: queryVariables.installment,
    startDueDate: queryVariables.startDate,
    paymentMethod: queryVariables.paymentMethod,
    tags: queryVariables.tags,
    tagsFilterType: queryVariables.tagsFilterType,
    ...partialFilter,
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
  queryKey: [ 'bills-daily-report', queryVariables ],
  queryFn: () => getDailyReportBills(queryVariables),
  enabled: isQueryEnabled,
})

const submit = form.handleSubmit(async (values) => {
  queryVariables.endDate = values.endDate.toISOString()
  queryVariables.startDate = values.startDate.toISOString()
  queryVariables.isPaid = values.isPaid
  queryVariables.tags = values.tags
  queryVariables.paymentMethod = values.paymentMethod
  queryVariables.recipient = values.recipient
  queryVariables.installment = values.installment
  queryVariables.tagsFilterType = values.tagsFilterType
})

const { formatPrice } = priceFormat({
  minimumFractionDigits: 2
});

const tableHeaders = computed<VDataTable['$props']['headers']>(() => {
  if(!data.value?.length) {
    return []
  }

  const item = data.value.at(0)

  if(!item) {
    return [
      { title: 'Data de vencimento', key: 'date' }
    ]
  }

  return [
    { title: 'Data de vencimento', key: 'date' },
    ...Object.values(item.values).map((value) => ({ title: value.tag.name, headerProps: { color: value.tag.color } }))
  ]
})

const ITEMS_PER_PAGE_OPTIONS = [
  { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' }
]

const notify = useNotify();

const csvFileLoading = ref(false);
const downloadCsvFile = async () => {
  try {
    csvFileLoading.value = true;

    const csvBlob = await exportDailyReportBills(queryVariables)

    downloadBlob(csvBlob, `Relatório Diário de Contas`, 'csv');
  } catch (e) {
    notify.displayMessage({
      type: 'error',
      message: 'Erro ao exportar',
    });
  } finally {
    csvFileLoading.value = false;
  }
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    width="1000"
    close-on-back
  >
    <VCard>
      <VToolbar
        dark
        color="primary"
        title="Relatório diário de contas"
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

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-sm">
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

            <ESelectBillInstallments
              name="installment"
            />

            <BillTagsSelect
              name="tags" 
            />

            <BillTagsFilterTypeSelect
              v-show="form.values.tags?.length"
              name="tagsFilterType"
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

          <div class="flex gap-x-2">
            <VBtn color="primary" type="submit">
              Gerar relatório
            </VBtn>
  
            <VBtn
              v-if="data"
              color="purple"
              :loading="csvFileLoading"
              @click="downloadCsvFile"
            >
              Exportar CSV
            </VBtn>
          </div>
        </form>

        <div v-if="isLoading && isQueryEnabled">
          <VSkeletonLoader type="table-row-divider" />
          <VSkeletonLoader type="table-row" />
          <VSkeletonLoader type="table-row" />
          <VSkeletonLoader type="table-row" />
          <VSkeletonLoader type="table-row" />
          <VSkeletonLoader type="table-row" />
        </div>

        <VDataTable
          v-else-if="data"
          :headers="tableHeaders"
          :items="data"
          :loading="isLoading && isQueryEnabled"
          density="compact"
          fixed-header
          height="490"
          :hide-default-footer="true"
          :items-per-page="-1"
          :items-per-page-options="ITEMS_PER_PAGE_OPTIONS"
        >
          <template #headers="{ headers }">
            <tr>
              <template v-for="header in headers">
                <th v-for="item in header">
                  <VChip
                    v-if="item.headerProps?.color"
                    :color="item.headerProps.color"
                    variant="flat"
                    size="small"
                  >
                    {{ item.title }}
                  </VChip>

                  <template v-else>
                    {{ item.title }}
                  </template>
                </th>
              </template>
            </tr>
          </template>

          <template #item="{ item }">
            <tr>
              <td
                class="cursor-pointer underline text-blue-800"
                @click="setListingFilter({ dueDate: item.date, dateFilterType: 'day' })"
              >
                {{ dayjs(item.date).format('DD/MM/YYYY') }}
              </td>

              <template v-for="value in item.values">
                <td
                  v-if="value.amount"
                  class="cursor-pointer underline text-blue-800"
                  @click="setListingFilter({ dueDate: item.date, dateFilterType: 'day', tags: [ value.tag._id! ] })"
                >
                  {{ formatPrice(value.amount) }}
                </td>

                <td v-else>
                  -
                </td>
              </template>
            </tr>
          </template>
        </VDataTable>

        <VEmptyState
          v-else
          title="Nenhum dado encontrado"
          text="Nenhum dado foi encontrado para o período selecionado."
        />
      </div>
    </VCard>
  </VDialog>
</template>

<style scoped>
table > tbody > tr > td:nth-child(1), 
table > thead > tr > th:nth-child(1) {
  position: sticky !important; 
  position: -webkit-sticky !important; 
  left: 0; 
  z-index: 1;
  background: white;
}

table > thead > tr > th:nth-child(1) {
  z-index: 2 !important;
}
</style>
