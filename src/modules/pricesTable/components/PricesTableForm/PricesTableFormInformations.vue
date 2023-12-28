<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';

defineProps<{
  disabled: boolean;
}>();
</script>

<template>
  <section>
    <EInputText
      name="name"
      :disabled="disabled"
      label="Nome"
      :rules="[required]"
    />

    <ESelectCostsTable
      name="costTable"
      :disabled="disabled"
      return-object
      :clearable="false"
      :rules="[required]"
    />

    <ESelectPeople
      name="customer"
      :disabled="disabled"
      return-object
      label="Cliente"
    />

    <div class="flex items-left">
      <ESwitch
        name="archived"
        :disabled="disabled"
        label="Arquivar"
        class="w-100px"
      />
    </div>
  </section>
</template>