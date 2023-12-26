<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';

defineProps<{
  disabled: boolean;
}>();
</script>

<template>
  <section>
    <div class="font-bold">Produção</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
      <EInputPct
        name="production.lost"
        :disabled="disabled"
        label="Perda de produção"
      />

      <EInputText
        name="production.useCustomPackCostMultiplier"
        :disabled="disabled"
        type="number"
        label="Usar multiplicador de custo por pack personalizado"
        hint="Caso for mantido em 0, será usado o campo 'Unidades por pack'"
        persistent-hint
      />
    </div>
  </section>

  <VDivider class="m-y-sm" />

  <section>
    <div class="font-bold">Formulação</div>

    <EEditableListItem
      name="production.formulation"
      class="grid grid-cols-1 md:grid-cols-2 gap-x-sm"
      :disabled="disabled"
    >
      <template #default="{ index, removeItem }">
        <ESelectFeedstocks
          :name="`production.formulation.${index}.feedstock`"
          :disabled="disabled"
          return-object
          :rules="[required]"
        />

        <EInputText
          :name="`production.formulation.${index}.value`"
          :disabled="disabled"
          type="number"
          label="Volume usado"
          :rules="[required]"
        />

        <ESelect
          :name="`production.formulation.${index}.considerInWeightCalculation`"
          item-title="label"
          :return-object="false"
          :disabled="disabled"
          :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
          label="Considerar no cálculo de peso"
          :rules="[required]"
        />

        <div class="flex gap-x-sm">

          <ESelect
            :name="`production.formulation.${index}.considerInVolumeProduced`"
            item-title="label"
            :return-object="false"
            :disabled="disabled"
            :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
            label="É a quantidade de volume produzido"
            :rules="[required]"
          />

          <VBtn 
            :disabled="disabled"
            color="red"
            @click="removeItem"
            icon="mdi-trash-can"
          />
        </div>
      </template>
    </EEditableListItem>
  </section>
</template>