<script lang="ts" setup>
import { brazilianStates } from '@/src/core/constants/states';
</script>

<template>
  <VSelect
    :items="brazilianStates"
    item-title="label"
    item-value="value"
    label="UF"
  />
</template>
