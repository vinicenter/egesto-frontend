<script setup lang="ts">
import { ref } from 'vue';
import { required } from '@/src/core/utils/form-validator';

const emit = defineEmits([ 'update:order', 'update:orderBy' ]);

defineProps<{
  disabled?: boolean;
}>()

const shipment = defineModel<number>('shipment');
const tax = defineModel<number>('tax');
const expense = defineModel<number>('expense');
const productionLost = defineModel<number>('productionLost');

const menu = ref(false)
</script>

<template>
  <VMenu
    v-model="menu"
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
            v-model="shipment"
            :rules="[required]"
            :disabled="disabled"
            label="Frete (%)"
          />

          <EInputPct
            v-model="expense"
            :rules="[required]"
            :disabled="disabled"
            label="Despesas (%)"
          />

          <EInputPct
            v-model="productionLost"
            :rules="[required]"
            :disabled="disabled"
            label="Perdas de produção (%)"
          />

          <EInputPct
            v-model="tax"
            :rules="[required]"
            :disabled="disabled"
            label="Impostos (%)"
          />
      </div>
    </VCard>
  </VMenu>
</template>