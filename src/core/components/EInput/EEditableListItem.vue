<script lang="ts" setup>
import { useAttrs, computed } from 'vue';
import { useFieldArray, useFormValues } from 'vee-validate'
import { resolve } from '@/src/core/utils/utils'
import { toRef } from 'vue';

const props = defineProps<{
  name: string;
  disabled: boolean;
  disableAdd?: boolean;
  disableSpacer?: boolean;
}>()

const attrs = useAttrs()

const values = useFormValues()
const arrayValues = computed(() => {
  return resolve(props.name, values.value)
})

const { fields, push, remove } = useFieldArray(toRef(props, 'name'))

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

    <div
      v-if="!(disableAdd && ((idx + 1) === fields.length))"
      class="flex justify-center grid-col-span-3"
    >
      <div class="w-98%">
        <VDivider v-if="!disableSpacer" class="m-b-sm grid-col-span-3" />
      </div>
    </div>
  </div>
  
  <VBtn
    v-if="!disableAdd"
    class="m-l-sm m-b-sm"
    @click="push({})"
    color="green"
    :disabled="disabled"
    icon="mdi-plus"
  />
</template>
