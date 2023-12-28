<script lang="ts" setup>
import { useAttrs, computed } from 'vue';
import { useFieldArray, useFormValues } from 'vee-validate'
import { resolve } from '@/src/core/utils/utils'

const props = defineProps<{
  name: string;
  disabled: boolean;
}>()

const attrs = useAttrs()

const values = useFormValues()
const arrayValues = computed(() => {
  return resolve(props.name, values.value)
})

const { fields, push, remove } = useFieldArray(props.name)

const emit = defineEmits(['update:model-value'])

function removeItem(idx: number) {
  remove(idx)
}

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div v-if="!fields.length">
    Nenhum item adicionado
  </div>

  <div v-for="(field, idx) in fields" :key="field.key">
    <div v-bind="attrs">
      <slot
        :item="arrayValues[idx]"
        :index="idx"
        :removeItem="() => removeItem(idx)"
      />
    </div>

    <div class="flex justify-center grid-col-span-3">
      <div class="w-98%">
        <VDivider class="m-b-sm grid-col-span-3" />
      </div>
    </div>
  </div>
  
  <VBtn
    class="m-l-sm m-b-sm"
    @click="push({})"
    color="green"
    :disabled="disabled"
    icon="mdi-plus"
  />
</template>
