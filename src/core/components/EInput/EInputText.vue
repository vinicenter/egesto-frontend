<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import { MaybeRef, toRef } from 'vue';

const props = defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<any>>,
  disabled?: boolean,
  type?: string,
  label: string,
  keepValuesOnUnmount?: boolean,
  loading?: boolean,
}>()

const { value, handleBlur, errorMessage } = useField<string>(toRef(props, "name"), props.rules, {
  keepValueOnUnmount: props.keepValuesOnUnmount,
})
</script>

<template>
  <VTextField
    v-model="value"
    :type="type"
    :label="label"
    :disabled="disabled"
    step="any"
    :error-messages="errorMessage"
    :loading="loading"
    @blur="handleBlur"
  />
</template>
