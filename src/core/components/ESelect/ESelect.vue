<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import { MaybeRef } from 'vue';

const props = defineProps<{
  name: string
  rules?: MaybeRef<RuleExpression<unknown>>
}>()

const { value, errorMessage, handleBlur } = useField<unknown>(props.name, props.rules)
</script>

<template>
  <VCombobox
    v-model="value"
    :return-object="false"
    clearable
    :error-messages="errorMessage"
    @blur="handleBlur"
  />
</template>
