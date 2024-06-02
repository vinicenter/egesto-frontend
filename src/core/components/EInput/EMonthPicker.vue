<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import { toRef } from 'vue';
import { MaybeRef } from 'vue';
import { computed } from 'vue';
import dayjs from '~utils/dayjs'

const props = defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<number | undefined>>,
  disabled?: boolean,
  label: string,
  hideDetails?: boolean
  clearable?: boolean
}>()

const { value, handleBlur, errorMessage } = useField<number | undefined>(toRef(props, "name"), props.rules)

const valueFormatted = computed(() => {
  if (value.value !== undefined) {
    const month = dayjs().set('month', value.value).format('MMMM')

    return month.charAt(0).toUpperCase() + month.slice(1)
  }

  return ''
})
</script>

<template>
  <VMenu :close-on-content-click="false" min-width="328px" location="center center">
    <template #activator="{ props }">
      <VTextField
        v-bind="props"
        v-model="valueFormatted"
        :label="label"
        readonly
        :clearable="clearable"
        :hide-details="hideDetails"
        append-inner-icon="mdi-calendar"
        :error-messages="errorMessage"
        @blur="handleBlur"
        @click:clear="value = undefined"
      />
    </template>

    <template #default="{ isActive }">
      <VCard>
        <VCardTitle>
          Selecione o mês
        </VCardTitle>
  
        <VDatePickerMonths
          v-model="value"
          :title="label"
          hide-header
          @update:model-value="isActive.value = false"
        />
      </VCard>
    </template>
	</VMenu>
</template>
