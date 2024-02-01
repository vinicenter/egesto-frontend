<script setup lang="ts">
import { numberFormat } from '@/src/core/utils/format';
import { IProduct } from '@/src/modules/products/types/product';
import { formatProductNameWithCode, formatFamilyLabel } from '../../../utils/formatter';

const { format } = numberFormat();

defineProps<{ productData: IProduct.Root | undefined }>()
</script>

<template>
  <div class="space-y-sm">
    <div class="text-lg">Informações básicas</div>

    <div class="grid grid-cols-3 gap-sm">
      <div>
        <div>Nome</div>
        {{ formatProductNameWithCode(productData?.name, productData?.code) }}
      </div>

      <div>
        <div>Familia</div>
        {{ formatFamilyLabel(productData?.family) }}
      </div>

      <div>
        <div>Marca</div>
        {{ productData?.brand?.name || '-' }}
      </div>
    </div>

    <VDivider />

    <div class="grid grid-cols-3 gap-sm">
      <div>
        <div>Unidades por pack</div>
        {{ format(productData?.pack?.numberOfUnitsInPack) }}
      </div>

      <div>
        <div>Peso por unidade</div>
        {{ format(productData?.unit?.weight) }}
      </div>

      <div>
        <div>Peso por pack</div>
        {{ format(productData?.packWeight) }}
      </div>
    </div>

    <VDivider />

    <div class="grid grid-cols-2 gap-sm">
      <div>
        <div>EAN-13</div>
        {{ productData?.unit?.barcodeEan13 || '-' }}
      </div>

      <div>
        <div>DUN-14</div>
        {{ productData?.pack?.barcodeDun14 || '-' }}
      </div>
    </div>

    <VDivider />

    <div class="grid grid-cols-3 gap-sm">
      <div>
        <div>NCM</div>
        {{ productData?.taxes?.ncm || '-' }}
      </div>

      <div>
        <div>CEST</div>
        {{ productData?.taxes?.cest || '-' }}
      </div>

      <div>
        <div>Packs no palete</div>
        {{ productData?.pack?.numberOfPacksInPallet || '-' }}
      </div>
    </div>
  </div>
</template>