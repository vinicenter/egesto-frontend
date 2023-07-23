<script lang="ts" setup>
import type { IProduct } from '../types/product';
import { required } from '@/src/core/utils/form-validator';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps<{
  model: IProduct.Root;
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

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
          v-model="model.pack.numberOfUnitsInPack"
          label="Unidades por pack"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.unit.weight"
          label="Peso unitário"
        />

        <VTextField
          :disabled="disabled"
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

    <div class="grid grid-cols-4 gap-x-sm">
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
    </div>
  </EForm>
</template>