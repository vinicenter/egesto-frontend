<script lang="ts" setup>
import ESelectPeople from '@/src/core/components/ESelect/ESelectPeople.vue';
import { IBillPaginationFilters } from '../types/bill';
import { useField } from 'vee-validate';
import { BILL_PAYMENT_METHOD } from '@/src/modules/bills/constants/bills';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import { required } from '@/src/core/utils/form-validator';
import { useBillsFilterStore } from '@/src/modules/bills/stores/use-bills-filter-store';
import BillTagsSelect from './BillTagsSelect/BillTagsSelect.vue';

const emit = defineEmits<{
  (e: 'update', value: Partial<IBillPaginationFilters>): void
}>()

const billsFilterStore = useBillsFilterStore()

const formId = 'billFilterForm'
const form = billsFilterStore.createForm()

const submit = billsFilterStore.submit()

const { value: dateFilterType } = useField('dateFilterType')
</script>

<template>
  <VMenu :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" color="blue">
        Filtros
      </VBtn>
    </template>

    <VCard title="Filtros" min-width="400" max-width="400">
      <VCardText>
        <form @submit.prevent="submit" class="space-y-sm" :id="formId">
          <div class="b-1px b-black b-solid p-sm p-b-xs space-y-sm">
            <div class="text-lg">
              Vencimento
            </div>

            <VBtnToggle
              v-model="dateFilterType"
              mandatory
              rounded="0"
              group
            >
              <VBtn value="day">
                Dia
              </VBtn>

              <VBtn value="month">
                Mês
              </VBtn>

              <VBtn value="period">
                Período
              </VBtn>

              <VBtn value="no-period">
                Todos
              </VBtn>
            </VBtnToggle>

            <template v-if="dateFilterType === 'month'">
              <EMonthPicker
                label="Mês de vencimento"
                name="dueMonth"
                hide-details
                :rules="required"
              />

              <EInputText
                type="number"
                label="Ano"
                name="dueYear"
                :rules="required"
                keep-values-on-unmount
              />
            </template>

            <template v-if="dateFilterType === 'day'">
              <EDatePicker
                label="Data de vencimento"
                name="dueDate"
              />
            </template>

            <template v-if="dateFilterType === 'period'">
              <EDatePicker
                label="Data de vencimento inicial"
                name="startDueDate"
                hide-details
                :max-date="form.values.endDueDate"
              />

              <EDatePicker
                label="Data de vencimento final"
                name="endDueDate"
                :min-date="form.values.startDueDate"
              />
            </template>
          </div>

          <BillTagsSelect
            name="tags" 
            hide-details
          />

          <ESelectPeople
            label="Recebedor"
            name="recipient"
            hide-details
          />

          <ESelect
            :items="BILL_PAYMENT_METHOD"
            :return-object="false"
            item-title="label"
            item-value="value"
            label="Forma de pagamento"
            name="paymentMethod"
            clearable
            hide-details
            multiple
          />

          <ESelect
            label="Status"
            item-title="label"
            item-value="value"
            name="isPaid"
            :clearable="false"
            :items="[
              { label: 'Pago', value: true },
              { label: 'Não pago', value: false },
              { label: 'Ambos', value: 'undefined' },
            ]"
            hide-details
          />

          <VBtn type="submit" color="blue">
            Filtrar
          </VBtn>
        </form>
      </VCardText>
    </VCard>
  </VMenu>
</template>
