<script setup lang="ts">
import { RuleExpression } from 'vee-validate';
import { MaybeRef } from 'vue';

defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<string>>,
  disabled?: boolean,
  label: string,
}>()
</script>

<template>
  <EInputText
    type="number"
    suffix="%"
    :rules="rules"
    :disabled="disabled"
    :name="name"
    :label="label"
  />
</template>
