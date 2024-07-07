<script setup lang="ts">
import EInputPrice from '@/src/core/components/EInput/EInputPrice.vue';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import { required } from '@/src/core/utils/form-validator';
import { priceFormat } from '@/src/core/utils/format';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { IBill } from '../../types/bill';
import dayjs from 'dayjs';

defineProps<{
  disabled?: boolean
  btnIcon: string
  btnLabel: string
}>()

const emit = defineEmits<{
  (e: 'bills-calculated', value: Partial<IBill>[]): void
}>()

const PORTION_TYPES = [
  {
    label: 'Dia fixo do mês',
    value: 'fixed'
  },
  {
    label: 'Dias corridos',
    value: 'running'
  }
]

interface FormType {
  firstDueDate: string
  portions: number
  portionPrice: number
  portionType: 'fixed' | 'running'
  portionDay: number
  portionInterval: number
}

const form = useForm<FormType>({
  initialValues: {
    firstDueDate: undefined,
    portionDay: undefined,
    portionInterval: undefined,
    portions: undefined,
    portionType: undefined,
    portionPrice: undefined,
  }
})

const { formatPrice } = priceFormat()

const totalValue = computed(() => {
  const total = (form.values.portionPrice * form.values.portions) || 0

  return formatPrice(total)
})

const submit = form.handleSubmit((values) => {
  const portions: Partial<IBill>[] = []

  for (let index = 0; index < values.portions; index++) {
    let dueDate = dayjs(values.firstDueDate)

    if(index !== 0) {
      if (values.portionType === 'fixed') {
        dueDate = dueDate.add(index, 'month').set('date', values.portionDay)
      } else {
        dueDate = dueDate.add(index * values.portionInterval, 'day')
      }
    }

    portions.push({
      amount: Number(values.portionPrice),
      dueDate: dueDate.toISOString(),
      isPaid: false,
      reference: `${index + 1}/${values.portions}`
    })
  }

  emit('bills-calculated', portions)
})
</script>

<template>
  <VDialog width="600">
    <template v-slot:activator="{ props }">
      <VBtn
        color="green"
        :disabled="disabled"
        :prepend-icon="btnIcon"
        v-bind="props"
      >
        {{ btnLabel }}
      </VBtn>
    </template>

    <template #default="{ isActive }">
      <VCard>
        <VToolbar
          color="primary"
          :title="btnLabel"
        >
          <VBtn
            icon
            dark
            @click="isActive.value = false"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VToolbar>
  
        <div class="p-sm">
          <form
            id="installment-form-portion-manage-modal"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-4" 
            @submit.prevent="submit"
          >
            <EDatePicker
              name="firstDueDate"
              label="Data da primeira parcela"
              :rules="[required]"
            />
  
            <EInputText
              type="number"
              name="portions"
              label="Número de parcelas"
              :rules="[required]"
              min="1"
            />
  
            <EInputPrice
              name="portionPrice"
              label="Valor da parcela"
              min="1"
              :rules="[required]"
            />
  
            <ESelect
              name="portionType"
              label="Tipo de parcela"
              :return-object="false"
              item-title="label"
              item-value="value"
              :items="PORTION_TYPES"
              :rules="[required]"
            />
  
            <EInputText
              v-if="form.values.portionType === 'fixed'"
              type="number"
              name="portionDay"
              label="Dia da parcela"
              max="31"
              min="1"
              :rules="[required]"
            />
  
            <EInputText
              v-if="form.values.portionType === 'running'"
              type="number"
              name="portionInterval"
              label="Intervalo de dias"
              min="1"
              :rules="[required]"
            />
          </form>

          <div class="m-b-sm">
            Valor total: {{ totalValue }}
          </div>

          <div class="flex gap-x-sm">
            <VBtn
              color="green"
              type="submit"
              form="installment-form-portion-manage-modal"
            >
              Calcular
            </VBtn>
          </div>
        </div>
      </VCard>
    </template>
  </VDialog>
</template>
