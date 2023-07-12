<script lang="ts" setup>
import { brazilianStates } from '~constants/states';
</script>

<template>
  <VCombobox
    :items="brazilianStates"
    :return-object="false"
    item-title="label"
    item-value="value"
    label="UF"
  />
</template>
