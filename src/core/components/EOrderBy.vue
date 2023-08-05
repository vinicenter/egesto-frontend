<script setup lang="ts">
import { computed } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  order: 'DESC' | 'ASC';
  orderBy: string;
  columnsToOrder: { label: string; orderByValue: string; }[];
}>();

const emit = defineEmits([ 'update:order', 'update:orderBy' ]);

const order = computed({
  get: () => props.order,
  set: (value) => emit('update:order', value)
})

const orderBy = computed({
  get: () => props.orderBy,
  set: (value) => emit('update:orderBy', value)
})

const orderOptions = [
  { label: 'Crescente', value: 'ASC' },
  { label: 'Decrescente', value: 'DESC' }
]

const menu = ref(false)
</script>

<template>
  <VMenu
    v-model="menu"
    :close-on-content-click="false"
    location="end"
  >
    <template v-slot:activator="{ props }">
      <VBtn
        color="indigo"
        v-bind="props"
      >
        Ordenação
      </VBtn>
    </template>

    <VCard min-width="300">
      <VSelect
        v-model="order"
        :items="orderOptions"
        item-title="label"
        item-value="value"
        label="Ordenar por"
        class="ml-sm"
      />

      <VSelect
        v-model="orderBy"
        :items="columnsToOrder"
        item-title="label"
        item-value="orderByValue"
        label="Ordenar por"
        class="ml-sm"
      />
    </VCard>
  </VMenu>
</template>