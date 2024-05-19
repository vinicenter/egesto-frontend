<script setup lang="ts">
import { IFamily } from '@/src/modules/families/types/family';
import { useFieldValue, useForm } from 'vee-validate';
import { PricesTableFormType } from '../../../types/pricesTable';
import { computed } from 'vue';
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';

defineProps<{
  disabled?: boolean
}>()

const prices = useFieldValue<PricesTableFormType.Price[]>('prices')

const emit = defineEmits<{
  (e: 'filter', values: FormValues): void
}>()

const families = computed(() => {
  const families = prices.value.map((item) => item.product.family)

  const uniqueFamilies = families.reduce((acc: IFamily[], family) => {
    if (!family?._id) return acc

    if (acc.some((_family) => _family._id === family._id)) return acc

    acc.push(family)

    return acc
  }, [])

  return uniqueFamilies
})

interface FormValues {
  families: IFamily[]
  search: string
}

const form = useForm<FormValues>({
  initialValues: {
    families: [],
    search: ''
  }
})

const submit = form.handleSubmit((values) => {
  emit('filter', values)
})
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-2 gap-sm">
    <EInputText
      :disabled="disabled"
      label="Pesquisar produto"
      name="search"
      hide-details
      clearable
      @keyup.enter="submit"
      @blur="submit"
    />

    <ESelect
      :disabled="disabled"
      label="Filtrar por família"
      hide-details
      multiple
      item-value="_id"
      :item-title="formatFamilyLabel"
      :items="families"
      name="families"
      @blur="submit"
    />
  </form>
</template>
