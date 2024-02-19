<script setup lang="ts">
import { computed } from 'vue';
import { IFamily } from '../../../types/family';
import type { VDataTable } from 'vuetify/lib/components/index.mjs';

const props = defineProps<{
  family: IFamily
  defaultCosts: number
}>()

const costs = computed(() => {
  const costsList = []

  for (const cost of props.family.costs) {
    costsList.push({
      name: cost.name,
      value: cost.value
    })
  }

  costsList.push({
    name: 'Custos padrões',
    value: props.defaultCosts
  })

  return costsList
})

const costsHeader: VDataTable['headers'] = [
  {
    title: 'Nome',
    value: 'name'
  },
  {
    title: 'Custo',
    value: 'value'
  }
]

const title = computed(() => `Custos de ${props.family.name}`)
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="center"
  >
    <template v-slot:activator="{ props }">
      <div v-bind="props" class="cursor-pointer decoration-underline">
        {{ `${Number(family.totalCosts) + Number(defaultCosts)}%` }}
      </div>
    </template>

    <VCard :title="title">
      <VCardText>
        <VDataTable
          :headers="costsHeader"
          :items="costs"
          :hide-default-footer="true"
          itemsPerPageText="Itens por página"
        />
      </VCardText>
    </VCard>
  </VMenu>
</template>