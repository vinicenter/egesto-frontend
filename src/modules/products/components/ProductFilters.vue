<script lang="ts" setup>
import type { IProduct } from '@/src/modules/products/types/product';

const model = defineModel<Partial<IProduct.Filters>>({
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
        <ESelectFamilies v-model="model.familyId" label="Família" familyType="linked" />
        <ESelectBrands v-model="model.brandId" label="Marca" />
        <VCheckbox v-model="model.onlyFeedstockEnabled" label="Somente produtos que podem ser matéria prima" />
      </VCardText>
    </VCard>
  </VMenu>
</template>
