<script setup lang="ts">
defineProps<{
  title: string
}>()

const modelValue = defineModel<boolean>()
</script>

<template>
  <VDialog
    v-model="modelValue"
    v-slot="{ isActive }"
  >
    <VToolbar
      color="primary"
      :title="title"
      class="rounded-t"
    />

    <VCard rounded="0" class="rounded-b">
      <section class="max-h-90vh overflow-y-auto">
        <slot />
      </section>
  
      <VCardActions class="justify-end">
        <slot name="actions" :isActive="isActive" />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
