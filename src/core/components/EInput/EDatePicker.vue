<script setup lang="ts">
import { Dayjs } from 'dayjs';
import { RuleExpression, useField } from 'vee-validate';
import { toRef } from 'vue';
import { MaybeRef } from 'vue';
import { computed } from 'vue';
import dayjs from '~utils/dayjs'

const props = defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<string>>,
  disabled?: boolean,
  label: string,
  maxDate?: Dayjs | Date | string,
  minDate?: Dayjs | Date | string,
  hideDetails?: boolean
}>()

const { value, handleBlur, errorMessage } = useField<string>(toRef(props, "name"), props.rules, {
  syncVModel: true
})

const valueFormatted = computed(() => {
  if (value.value) {
    return dayjs(value.value).format('DD/MM/YYYY')
  }

  return ''
})
</script>

<template>
  <VMenu :close-on-content-click="false" min-width="328px" location="center center">
    <template v-slot:activator="{ props }">
      <VTextField
        v-bind="props"
        v-model="valueFormatted"
        :label="label"
        readonly
        clearable
        :hide-details="hideDetails"
        append-inner-icon="mdi-calendar"
        :error-messages="errorMessage"
        @blur="handleBlur"
        @click:clear="value = ''"
      />
    </template>

    <VCard>
      <VCardTitle>
        Selecione a data
      </VCardTitle>

      <VDatePicker
        v-model="value"
        :max="maxDate"
        :min="minDate"
        :title="label"
        hide-header
      />
    </VCard>
	</VMenu>
</template>
