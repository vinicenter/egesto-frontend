<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';

const emit = defineEmits([ 'update:order', 'update:orderBy' ]);

defineProps<{
  disabled?: boolean;
  shipment: string,
  tax: string,
  expense: string,
  productionLost: string,
}>()
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="bottom"
  >
    <template v-slot:activator="{ props }">
      <VBtn 
        :disabled="disabled"
        color="primary"
        v-bind="props"
        icon="mdi-pencil-plus"
      />
    </template>

    <VCard
      title="Custos"
      min-width="300"
    >
      <div class="mx-sm">
        <EInputPct
          :name="shipment"
          :rules="[required]"
          :disabled="disabled"
          label="Frete (%)"
        />

        <EInputPct
          :name="expense"
          :rules="[required]"
          :disabled="disabled"
          label="Despesas (%)"
        />

        <EInputPct
          :name="productionLost"
          :rules="[required]"
          :disabled="disabled"
          label="Perdas de produção (%)"
        />

        <EInputPct
          :name="tax"
          :rules="[required]"
          :disabled="disabled"
          label="Impostos (%)"
        />
      </div>
    </VCard>
  </VMenu>
</template>