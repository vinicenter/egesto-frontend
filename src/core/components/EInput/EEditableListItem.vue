<script lang="ts" setup>
import { useFieldArray } from 'vee-validate'
import { useAttrs } from 'vue';

const props = defineProps<{
  name: string;
  disabled: boolean;
}>()

const attrs = useAttrs()

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
        :item="field.value"
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
