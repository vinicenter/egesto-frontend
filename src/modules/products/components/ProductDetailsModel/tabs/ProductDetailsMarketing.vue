<script setup lang="ts">
import { IProduct } from '@/src/modules/products/types/product';

defineProps<{ productData: IProduct.Root | undefined }>()
</script>

<template>
  <VAlert
    density="compact"
    color="info"
    title="Marketing"
  >
    <div v-if="productData?.marketing?.isPublic">
      Produto Público - Aparece no site
      <VIcon icon="mdi-lock-open" />
    </div>

    <div v-else>
      Produto Privado - Não aparece no site
      <VIcon icon="mdi-lock" />
    </div>

    <div v-if="productData?.marketing?.color">
      Cor: {{ productData?.marketing?.color }}
    </div>

    <div
      v-if="productData?.marketing?.description"
      class="truncate"
      :title="productData?.marketing?.description"
    >
      {{ productData?.marketing?.description }}
    </div>
  </VAlert>
</template>
