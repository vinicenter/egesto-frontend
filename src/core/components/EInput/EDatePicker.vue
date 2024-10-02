<script setup lang="ts">
import { Dayjs } from 'dayjs';
import { nextTick } from 'vue';
import { RuleExpression, useField } from 'vee-validate';
import { toRef } from 'vue';
import { ref } from 'vue';
import { MaybeRef } from 'vue';
import { computed } from 'vue';
import { VMenu } from 'vuetify/lib/components/index.mjs';
import dayjs from '~utils/dayjs'

const props = defineProps<{
  name: string,
  rules?: MaybeRef<RuleExpression<string | undefined>>,
  disabled?: boolean,
  label: string,
  maxDate?: Dayjs | Date | string,
  minDate?: Dayjs | Date | string,
  hideDetails?: boolean
}>()

const { value, handleBlur, errorMessage } = useField<string | undefined>(toRef(props, "name"), props.rules, {
  syncVModel: true
})

const valueFormatted = computed(() => {
  if (value.value) {
    return dayjs(value.value).format('DD/MM/YYYY')
  }

  return ''
})

const isMenuActive = ref(false)

const handleClearButton = async () => {
  isMenuActive.value = false

  await nextTick()

  value.value = undefined
}
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    min-width="328px"
    location="center center"
    v-model="isMenuActive"
  >
    <template #activator="{ props }">
      <VTextField
        v-bind="props"
        :model-value="valueFormatted"
        :label="label"
        readonly
        clearable
        :disabled="disabled"
        :hide-details="hideDetails"
        append-inner-icon="mdi-calendar"
        :error-messages="errorMessage"
        @blur="handleBlur"
        @click:clear="handleClearButton"
      />
    </template>

    <template #default>
      <VCard>
        <VCardTitle>
          <div class="flex justify-between">
            <div>Selecione a data</div>

            <VBtn
              icon
              size="sm"
              variant="text"
              @click="isMenuActive = false"
            >
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </div>
        </VCardTitle>

        <VDatePicker
          v-model="value"
          :max="maxDate"
          :min="minDate"
          :title="label"
          hide-header
          @update:model-value="isMenuActive = false"
        />
      </VCard>
    </template>
	</VMenu>
</template>
