<script setup lang="ts">
const emit = defineEmits(['refetch'])
</script>

<template>
  <VCard flat>
    <div class="flex flex-col items-center justify-center p-sm space-y-sm">
      <div class="text-md">Algo errado aconteceu!</div>
      <VBtn
        @click="emit('refetch')"
        icon="mdi-refresh"
        title="Tentar novamente!"
      />
    </div>
  </VCard>
</template>
