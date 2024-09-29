<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ACCOUNT_TYPE } from '../constants/bank';

const search = ref('')

const filteredAccountTypes = computed(() => {
  return ACCOUNT_TYPE.filter((type) => {
    return type.label.toLowerCase().includes(search.value.toLowerCase())
  })
})
</script>

<template>
  <ESelect
    v-model:search="search"
    :items="filteredAccountTypes"
    :return-object="false"
    item-title="label"
    item-value="value"
    label="Tipo de conta"
    searchable
    clearable
  />
</template>
