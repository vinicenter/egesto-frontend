<script lang="ts" setup>
import { ref, computed } from 'vue';
import { brazilianStates } from '~constants/states';

const search = ref('')

const filteredBrazilianStates = computed(() => {
  return brazilianStates.filter((state) => {
    return state.label.toLowerCase().includes(search.value.toLowerCase())
  })
})
</script>

<template>
  <ESelect
    v-model:search="search"
    :items="filteredBrazilianStates"
    :return-object="false"
    item-title="label"
    item-value="value"
    label="UF"
    clearable
  />
</template>
