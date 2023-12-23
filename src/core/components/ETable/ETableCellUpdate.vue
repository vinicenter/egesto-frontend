<script setup lang="ts">
import { Form } from 'vee-validate';

defineProps<{
  label: string
  initialValues: any
}>()

const emit = defineEmits<{
  (e: 'submit', values: any): void
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
      <Form :initial-values="initialValues" @submit="emit('submit', $event)">
        <VCard>
          <slot name="content" />
        </VCard>
      </Form>
    </template>
  </VMenu>
</template>
