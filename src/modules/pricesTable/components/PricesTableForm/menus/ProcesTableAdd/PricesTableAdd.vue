<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', indexPrice: number): void
}>()

const tab = ref<'family' | 'products'>()
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="bottom"
    class="max-w-300px"
  >
    <template v-slot:activator="{ props: propsMenu }">
      <VTooltip
        open-on-click
        location="top"
      >
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="{ ...props, ...propsMenu }"
            prepend-icon="mdi-plus"
            color="primary"
            :disabled="disabled"
          >
            Adicionar
          </VBtn>
        </template>

        <span>Adicione novos itens a tabela de preço</span>
      </VTooltip>
    </template>

    <VCard
      title="Adicionar"
      min-width="400"
    >
      <VTabs grow v-model="tab">
        <VTab value="family">
          Família
        </VTab>
        <VTab value="products">
          Produtos
        </VTab>
      </VTabs>

      <VWindow v-model="tab">
        <VWindowItem value="family" class="m-t-sm" eager>
          <PricesTableAddFamily
            :disabled="disabled"
            @set-product-data-to-price="emit('setProductDataToPrice', $event)"
          />
        </VWindowItem>

        <VWindowItem value="products" class="m-t-sm" eager>
          <PricesTableAddProducts
            :disabled="disabled"
            @set-product-data-to-price="emit('setProductDataToPrice', $event)"
          />
        </VWindowItem>
      </VWindow>
    </VCard>
  </VMenu>
</template>
