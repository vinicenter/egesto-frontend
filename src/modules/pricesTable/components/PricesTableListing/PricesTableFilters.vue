<script lang="ts" setup>
import { PricesTableFilters } from "@/src/modules/pricesTable/types/pricesTable";

const model = defineModel<PricesTableFilters>({
  required: true
})
</script>

<template>
  <VMenu :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" color="blue">
        Filtros
      </VBtn>
    </template>

    <VCard title="Filtros" min-width="400">
      <VCardText>
        <VCheckbox v-model="model.archived" label="Arquivados" />
      </VCardText>
    </VCard>
  </VMenu>
</template>
