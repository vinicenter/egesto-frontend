<script lang="ts" setup>
import { brazilianStates } from '~constants/states';
</script>

<template>
  <ESelect
    :items="brazilianStates"
    :return-object="false"
    item-title="label"
    item-value="value"
    label="UF"
    clearable
  />
</template>
