<script setup lang="ts">
defineProps<{
  disabled: boolean;
}>();
</script>

<template>
  <section>
    <div class="font-bold">Informações do produto</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-sm">
      <EInputText
        name="pack.numberOfUnitsInPack"
        :disabled="disabled"
        type="number"
        label="Unidades por pack"
      />

      <EInputText
        name="unit.weight"
        :disabled="disabled"
        type="number"
        label="Peso unitário"
      />

      <EInputText
        name="pack.numberOfPacksInPallet"
        :disabled="disabled"
        type="number"
        label="Quantidade de pack no pallet"
      />

      <EInputText
        name="UnitOfMeasurement"
        :disabled="disabled"
        label="Unidade de medida"
      />

      <EInputText
        name="price"
        :disabled="disabled"
        type="number"
        label="Preço"
      />
    </div>

    <div class="font-bold">Informações de identificação</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
      <EInputText
        name="unit.barcodeEan13"
        :disabled="disabled"
        label="EAN-13"
      />

      <EInputText
        name="pack.barcodeDun14"
        :disabled="disabled"
        label="DUN-14"
      />

      <EInputText
        name="taxes.cest"
        :disabled="disabled"
        label="CEST"
      />

      <EInputText
        name="taxes.ncm"
        :disabled="disabled"
        label="NCM"
      />
    </div>
  </section>
</template>