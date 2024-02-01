<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import { MaybeRef, toRef } from 'vue';

const props = defineProps<{
  name: string;
  disabled?: boolean;
  label: string;
  rules?: MaybeRef<RuleExpression<boolean | undefined>>
}>();

const { value, handleBlur } = useField<boolean | undefined>(toRef(props, "name"), props.rules);
</script>

<template>
  <VSwitch
    v-model="value"
    color="primary"
    :disabled="disabled"
    :label="label"
    inset
    @blur="handleBlur"
  />
</template>