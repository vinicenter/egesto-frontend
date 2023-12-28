<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';
import { useFormValues } from 'vee-validate';
import { IPricesTable } from '../../types/pricesTable';

defineProps<{
  disabled: boolean;
}>();

const fields = useFormValues<IPricesTable.Root>()
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
      return-object
      label="Cliente"
      :disabled="disabled || !fields.costTable"
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