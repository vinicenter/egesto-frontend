<script setup lang="ts">
defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <section>
    <div class="font-bold">Despesas</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
      <EInputPct
        name="expenses.contract"
        :disabled="disabled"
        label="Despesas com contrato"
      />

      <EInputPct
        name="expenses.marketing"
        :disabled="disabled"
        label="Despesas com marketing"
      />

      <EInputPct
        name="expenses.additional"
        :disabled="disabled"
        label="Despesas acessórias"
      />
    </div>
  </section>
</template>
