<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="center"
  >
    <template #activator="{ props }">
      <p class="cursor-pointer" v-bind="props">{{ label }}</p>
    </template>

    <template #default>
      <VCard>
        <slot name="content" />
      </VCard>
    </template>
  </VMenu>
</template>
