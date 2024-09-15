<script setup lang="ts">
import { toRef } from '@vueuse/core';
import { RuleExpression, useFieldArray } from 'vee-validate';
import { onMounted } from 'vue';
import { MaybeRef } from 'vue';

const props = defineProps<{
  name: string
  rules?: MaybeRef<RuleExpression<string | undefined>>,
  size: number
  rounded?: boolean
}>()

const {
  fields,
  push,
  remove,
} = useFieldArray<string | undefined>(toRef(props, 'name'))

onMounted(()=>{
  push(undefined)
})

const onUploaded = () => {
  if(fields.value[fields.value.length - 1]) {
    push(undefined)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <EImageUpload
      v-for="field, index in fields"
      :key="field.key"
      :name="`${name}.${index}`"
      :size="size"
      :rounded="rounded"
      :rules="rules"
      @uploaded="onUploaded"
      @deleted="remove(index)"
    />
  </div>
</template>
