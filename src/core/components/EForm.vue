<script setup lang="ts">
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify'

const { displayMessage } = useNotify()

const VFormRef = ref()

const emit = defineEmits(['submit']);

const isFormCompleted = ref(false);

const onSubmit = async (event: object) => {
  await VFormRef.value.validate()

  if(!isFormCompleted.value) {
    displayMessage({
      message: 'Preencha todos os campos obrigatórios',
      type: 'warning'
    })

    return
  }

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
  >
    <slot />
  </VForm>
</template>
