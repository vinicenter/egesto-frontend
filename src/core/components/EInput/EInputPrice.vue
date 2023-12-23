<script setup lang="ts">
import { RuleExpression } from 'vee-validate';
import { MaybeRef } from 'vue';

defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<string>>,
  disabled?: boolean,
}>()
</script>

<template>
  <EInputText
    type="number"
    label="Preço"
    prefix="R$"
    :rules="rules"
    :disabled="disabled"
    :name="name"
  />
</template>
