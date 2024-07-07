<script setup lang="ts">
defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <ESelectPeople
        name="recipient"
        label="Recebedor"
        :disabled="disabled"
        return-object
      />

      <BillTagsSelect
        name="tags"
        return-object
        editable
        :disabled="disabled"
      />
    </div>

    <ETextarea
      :disabled="disabled"
      name="observations"
      label="Observação"
    />
  </div>
</template>