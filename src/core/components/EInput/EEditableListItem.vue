<script lang="ts" generic="T" inherit-attrs="false" setup>
import { useFormValues, useSetFieldValue } from 'vee-validate';
import { computed, useAttrs } from 'vue';
import { resolve } from '@/src/core/utils/utils';

const props = defineProps<{
  name: string
  disabled: boolean;
}>()

const setField = useSetFieldValue(props.name)
const values = useFormValues()
const field = computed(() => resolve(props.name, values.value))

const attrs = useAttrs()

const emit = defineEmits(['update:model-value'])

const removeItem = (index: number) => field.value.splice(index, 1)
const addItem = () => setField([ ...field.value, {} ])
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="!field.length">
    Nenhum item adicionado
  </div>

  <div v-for="(item, index) in field" :key="`generic-list-${index}`">
    <div v-bind="attrs">
      <slot :item="item" :index="index" :remove-item="() => removeItem(index)" />
    </div>

    <div class="flex justify-center grid-col-span-3">
      <div class="w-98%">
        <VDivider class="m-b-sm grid-col-span-3" />
      </div>
    </div>
  </div>

  <VBtn
    class="m-l-sm m-b-sm"
    @click="addItem"
    color="green"
    :disabled="disabled"
    icon="mdi-plus"
  />
</template>
