<script setup lang="ts">
import { RuleExpression, useField, useFieldValue } from 'vee-validate';
import { useAttrs } from 'vue';
import { MaybeRef } from 'vue';

const props = defineProps<{
  name: string
  disabled: boolean
  title: string
  rules?: MaybeRef<RuleExpression<string>>,
}>()

const color = useFieldValue(props.name)
const attrs = useAttrs()

const { value, handleBlur, errorMessage } = useField<string>(props.name, props.rules)
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="center"
  >
    <template #activator="{ props }">
      <div class="flex flex-col justify-center items-center w-100px">
        <VBtn
          :disabled="disabled"
          :color="`${color || 'primary'}`"
          v-bind="props"
          :title="title"
          icon="mdi-palette-outline"
          @blur="handleBlur"
        />
        <div class="text-red-500 text-center">{{ errorMessage }}</div>
      </div>
    </template>

    <template #default>
      <VCard>
        <VColorPicker
          v-model="value"
          v-bind="attrs"
          :disabled="disabled"
          :modes="['hex']"
          @blur="handleBlur"
        />
      </VCard>
    </template>
  </VMenu>
</template>
