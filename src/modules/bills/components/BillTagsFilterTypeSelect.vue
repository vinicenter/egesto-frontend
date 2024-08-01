<script setup lang="ts">
const options = [
  {
    value: 'OR',
    title: 'Contas que tenham alguma das tags'
  },
  {
    value: 'AND',
    title: 'Contas que tenham todas as tags'
  },
]
</script>

<template>
  <ESelect
    label="Tipo de filtro de tags"
    :items="options"
    :return-object="false"
    item-title="title"
    item-value="value"
    :clearable="false"
  />
</template>
