<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import { MaybeRef, toRef } from 'vue';

const props = defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<string>>,
  disabled?: boolean,
  type?: string,
  label: string,
}>()

const { value, handleBlur, errorMessage } = useField<string>(toRef(props, "name"), props.rules)
</script>

<template>
  <VTextarea
    v-model="value"
    :type="type"
    :label="label"
    :disabled="disabled"
    :error-messages="errorMessage"
    @blur="handleBlur"
  />
</template>
