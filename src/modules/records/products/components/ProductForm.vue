<script lang="ts" setup>
import type { IProduct } from '../types/product';
import { required } from '@/src/core/utils/form-validator';
import { toRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  model: IProduct.Root;
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const model = toRef(props, 'model');

const addNewFormulation = () => {
  const value = {
    value: undefined,
    feedstock: undefined,
    considerInWeightCalculation: false
  };

  model.value.production.formulation.push(value);
};

const removeFormulation = (index: number) => {
  model.value.production.formulation.splice(index, 1);
};

const emit = defineEmits(['submit']);
</script>

<template>
  <EForm @submit="emit('submit', $event)">

    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
        <VTextField
          :disabled="disabled"
          v-model="model.code"
          label="Código"
          :rules="[required]"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.name"
          label="Nome"
          :rules="[required]"
        />

        <ESelectFamilies
          :disabled="disabled"
          v-model="model.family"
          return-object
        />

        <ESelectBrands
          :disabled="disabled"
          v-model="model.brand"
          return-object
        />
      </div>


      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-sm">
        <VTextField
          :disabled="disabled"
          type="number"
          v-model="model.pack.numberOfUnitsInPack"
          label="Unidades por pack"
        />

        <VTextField
          :disabled="disabled"
          type="number"
          v-model="model.unit.weight"
          label="Peso unitário"
        />

        <VTextField
          :disabled="disabled"
          type="number"
          v-model="model.pack.numberOfPacksInPallet"
          label="Quantidade de pack no pallet"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.UnitOfMeasurement"
          label="Unidade de medida"
        />
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
        <VTextField
          :disabled="disabled"
          v-model="model.unit.barcodeEan13"
          label="EAN-13"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.pack.barcodeDun14"
          label="DUN-14"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.taxes.cest"
          label="CEST"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.taxes.ncm"
          label="NCM"
        />
      </div>
    </section>

    <VDivider class="m-y-sm" />

    <section>
      <div class="font-bold">Marketing</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
        <VSelect
          v-model="model.marketing.isPublic"
          :disabled="disabled"
          :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
          :return-object="false"
          hint="Se o produto for público, ele será exibido no site."
          persistent-hint
          item-title="label"
          label="Produto público"
        />

        <VColorPicker
          v-model="model.marketing.color"
          :disabled="disabled"
          :modes="['hex']"
        />
      </div>

      <VTextarea
        v-model="model.marketing.description"
        type="textarea"
      />
    </section>

    <VDivider class="m-y-sm" />

    <section>
      <div class="font-bold">Formulação</div>

      <div
        v-for="(formulation, index) in model.production.formulation" :key="`formulation-${index}`"
        class="grid grid-cols-1 md:grid-cols-3 gap-x-sm"
      >
        <ESelectFeedstocks
          :disabled="disabled"
          v-model="formulation.feedstock"
          return-object
          :rules="[required]"
        />

        <VTextField
          :disabled="disabled"
          type="number"
          v-model="formulation.value"
          label="Volume usado"
          :rules="[required]"
        />

        <div class="flex gap-x-sm">
          <VSelect
            item-title="label"
            v-model="formulation.considerInWeightCalculation"
            :return-object="false"
            :disabled="disabled"
            :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
            label="Considerar no cálculo de peso"
          />

          <VBtn 
            :disabled="disabled"
            color="red"
            @click="removeFormulation(index)"
            icon="mdi-trash-can"
          />
        </div>
      </div>

      <VBtn 
        :disabled="disabled"
        @click="addNewFormulation"
        color="green"
        icon="mdi-plus"
      />
    </section>

    <VDivider class="m-y-sm" />

    <section class="grid grid-cols-4 gap-x-sm">
      <VBtn
        :loading="loading"
        color="primary"
        type="submit"
        class="w-20"
        block
      >
        {{ buttonLabel }}
      </VBtn>

      <VBtn
        @click="router.push({ name: 'list-products' })"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </section>
  </EForm>
</template>