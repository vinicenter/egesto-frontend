<script lang="ts" setup>
import ESelectPeople from '@/src/core/components/ESelect/ESelectPeople.vue';
import { IBillFilters } from '../types/bill';
import { useField, useForm } from 'vee-validate';
import dayjs from 'dayjs';
import { BILL_TYPES } from '@/src/modules/bills/constants/bills';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import { required } from '@/src/core/utils/form-validator';

const props = defineProps<{
  initialValues: Partial<IBillFilters>
}>()

const emit = defineEmits<{
  (e: 'update', value: Partial<IBillFilters>): void
}>()

interface BillFiltersInternal {
  dateFilterType: 'month' | 'day' | 'period';
  endDueDate?: string,
  startDueDate?: string,
  dueDate?: string,
  dueMonth?: number,
  dueYear?: number,
  recipient?: string,
  isPaid: boolean | undefined
  type?: "BOLETO" | "CHEQUE" | "PIX" | "TRANSFERENCIA_BANCARIA" | "DINHEIRO" | undefined
}

const buildInitialValues = (initialValues: Partial<IBillFilters>): BillFiltersInternal => {
  return {
    dateFilterType: 'period',
    dueYear: dayjs().year(),
    dueMonth: dayjs().month(),
    ...initialValues
  } as BillFiltersInternal
}

const { handleSubmit, values } = useForm<BillFiltersInternal>({
  initialValues: buildInitialValues(props.initialValues),
  keepValuesOnUnmount: true
})

const submit = handleSubmit((values) => {
  const getEndDueDate = () => {
    if(values.dateFilterType === 'month' && values.dueMonth !== undefined && values.dueYear !== undefined) {
      return dayjs().set('month', values.dueMonth).set('year', values.dueYear).endOf('month').toString()
    }

    return values.dateFilterType === 'day'
      ? values.dueDate
      : values.endDueDate
  }

  const getStartDueDate = () => {
    if(values.dateFilterType === 'month' && values.dueMonth !== undefined && values.dueYear !== undefined) {
      return dayjs().set('month', values.dueMonth).set('year', values.dueYear).startOf('month').toString()
    }

    return values.dateFilterType === 'day'
      ? values.dueDate
      : values.startDueDate
  }

  emit('update', {
    endDueDate: getEndDueDate(),
    startDueDate: getStartDueDate(),
    isPaid: values.isPaid,
    recipient: values.recipient,
    type: values.type,
  })
})

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
        <form @submit.prevent="submit" class="space-y-sm">
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
                :max-date="values.endDueDate"
              />

              <EDatePicker
                label="Data de vencimento final"
                name="endDueDate"
                :min-date="values.startDueDate"
              />
            </template>
          </div>

          <ESelectPeople
            label="Recebedor"
            name="recipient"
            hide-details
          />

          <ESelect
            :items="BILL_TYPES"
            :return-object="false"
            item-title="label"
            item-value="value"
            label="Tipo"
            name="type"
            clearable
            hide-details
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
