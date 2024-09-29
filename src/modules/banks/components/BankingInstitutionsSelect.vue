<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { getBankingInstitutions } from '../datasource/banking-institutions';

const search = ref('')

const {
  data,
} = useQuery({
  queryKey: [ 'banking-institutions' ],
  queryFn: () => getBankingInstitutions(),
})

const filteredBankingInstitutions = computed(() => {
  if(!data.value) return []

  return data.value.filter((bankingInstitution) => {
    const searchString = `${bankingInstitution.code} - ${bankingInstitution.name}`.toLowerCase()

    return searchString.toLowerCase().includes(search.value.toLowerCase())
  })
})

const bankingInstitutions = computed(() => {
  if(!filteredBankingInstitutions.value) return []

  return filteredBankingInstitutions.value.map((bankingInstitution) => {
    return {
      label: `${bankingInstitution.code} - ${bankingInstitution.name}`,
      value: bankingInstitution.code,
    }
  })
})
</script>

<template>
  <ESelect
    v-model:search="search"
    :items="bankingInstitutions"
    :return-object="false"
    item-title="label"
    item-value="value"
    label="Instituição bancária"
    searchable
    clearable
  />
</template>
