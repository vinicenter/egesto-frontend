<script lang="ts" generic="T" inherit-attrs="false" setup>
import { computed, useAttrs } from 'vue';

const props = defineProps<{
  modelValue: T[];
  disabled: boolean;
}>()

const attrs = useAttrs()

const emit = defineEmits(['update:model-value'])

const model = computed({
  get: () => props.modelValue,
  set: (value: T[]) => emit('update:model-value', value),
})

const removeItem = (index: number) => model.value.splice(index, 1)
const addItem = () => model.value.push({} as T)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="!model.length">
    Nenhum item adicionado
  </div>

  <div v-for="(item, index) in model" :key="`generic-list-${index}`">
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
