<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { refDebounced } from '@vueuse/core';
import { useFieldValue, useValidateField } from 'vee-validate';
import { toRef } from 'vue';
import { verifyProductCodeAvailability } from '@/src/modules/products/datasource/products';
import { computed, watch } from 'vue';

const props = defineProps<{
  productId?: string,
  name: string,
  disabled?: boolean,
  rules?: any[],
}>()

const inputValue = useFieldValue<string>(toRef(props, 'name'))
const inputValueDebounced = refDebounced(inputValue, 300)

const validate = useValidateField(props.name)

const isCodeCheckEnabled = computed(() => !props.disabled && !!inputValue.value)

const {
  data: codeAvailability,
  isFetching: isCodeAvailabilityLoading,
} = useQuery({
  queryKey: [ 'code-availability', inputValueDebounced, props.productId ],
  queryFn: async () => {
    return verifyProductCodeAvailability(inputValueDebounced.value, props.productId)
  },
  enabled: isCodeCheckEnabled,
  cacheTime: 0,
})

watch(codeAvailability, () => {
  validate()
})

const rules = [
  ...props.rules || [],
  (value: string) => {
    if(!value || !isCodeCheckEnabled.value) {
      return true
    }

    if(isCodeAvailabilityLoading.value || !codeAvailability.value) {
      return 'Verificando disponibilidade do código...'
    }

    return codeAvailability.value.available
      ? true
      : 'Código já está em uso'
  },
]
</script>

<template>
  <EInputText
    label="Código"
    :name="name"
    :disabled="disabled"
    :loading="isCodeAvailabilityLoading"
    :rules="rules"
  />
</template>
