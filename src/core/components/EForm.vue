<script setup lang="ts">
import { ref } from 'vue';

const VFormRef = ref()

const emit = defineEmits(['submit']);

const isFormCompleted = ref(false);

const onSubmit = async (event: object) => {
  await VFormRef.value.validate()

  if(!isFormCompleted.value) return

  emit('submit', event)
}
</script>

<template>
  <VForm
    ref="VFormRef"
    fast-fail
    validate-on="input"
    v-model="isFormCompleted"
    @submit.prevent="onSubmit"
    class="m-sm"
  >
    <slot />
  </VForm>
</template>
