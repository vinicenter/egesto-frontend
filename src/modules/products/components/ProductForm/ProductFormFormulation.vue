<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';
import { useFormValues } from 'vee-validate';
import { ref } from 'vue';
import { IProduct } from '../../types/product';

defineProps<{
  disabled: boolean;
}>();

const formValues = useFormValues<IProduct.Root>();

const formulationTab = ref<'feedstocks' | 'products'>('feedstocks')
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

      <ESwitch
        label="Pode ser usado como matéria prima"
        name="production.canBeFeedstock"
        hint="Ao habilitar, Só é possível usar matérias primas para formulação deste produto"
        @update:model-value="formulationTab = 'feedstocks'"
        persistent-hint
      />
    </div>
  </section>

  <VDivider class="m-y-sm" />

  <section>
    <div class="font-bold">Formulação</div>

    <VTabs grow class="m-y-4" v-model="formulationTab">
      <VTab value="feedstocks">
        Matérias primas
      </VTab>
      <VTab value="products" :disabled="formValues.production?.canBeFeedstock">
        Produtos
      </VTab>
    </VTabs>

    <VWindow v-model="formulationTab">
      <VWindowItem value="feedstocks" eager>
        <EEditableListItem
          name="production.formulation.feedstocks"
          class="grid grid-cols-1 md:grid-cols-2 gap-x-sm"
          :disabled="disabled"
        >
          <template #default="{ index, removeItem }">
            <ESelectFeedstocks
              :name="`production.formulation.feedstocks.${index}.feedstock`"
              :disabled="disabled"
              return-object
              :rules="[required]"
            />

            <EInputText
              :name="`production.formulation.feedstocks.${index}.value`"
              :disabled="disabled"
              type="number"
              label="Volume usado"
              :rules="[required]"
            />

            <ESelect
              :name="`production.formulation.feedstocks.${index}.considerInWeightCalculation`"
              item-title="label"
              :return-object="false"
              :disabled="disabled"
              :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
              label="Considerar no cálculo de peso"
              :rules="[required]"
            />

            <div class="flex gap-x-sm">

              <ESelect
                :name="`production.formulation.feedstocks.${index}.considerInVolumeProduced`"
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
      </VWindowItem>

      <VWindowItem value="products" eager>
        <EEditableListItem
          name="production.formulation.products"
          class="grid grid-cols-1 md:grid-cols-2 gap-x-sm"
          :disabled="disabled"
        >
          <template #default="{ index, removeItem }">
            <ESelectProducts
              :name="`production.formulation.products.${index}.product`"
              :disabled="disabled"
              return-object
              only-feedstock-enabled
              :rules="[required]"
            />

            <EInputText
              :name="`production.formulation.products.${index}.value`"
              :disabled="disabled"
              type="number"
              label="Volume usado"
              :rules="[required]"
            />

            <ESelect
              :name="`production.formulation.products.${index}.considerInWeightCalculation`"
              item-title="label"
              :return-object="false"
              :disabled="disabled"
              :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
              label="Considerar no cálculo de peso"
              :rules="[required]"
            />

            <div class="flex gap-x-sm">

              <ESelect
                :name="`production.formulation.products.${index}.considerInVolumeProduced`"
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
      </VWindowItem>
    </VWindow>
  </section>
</template>