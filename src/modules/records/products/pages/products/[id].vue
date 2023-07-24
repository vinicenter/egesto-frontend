<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createProduct, deleteProduct, getProduct, updateProduct } from '../../datasource/products';
import { IProduct } from '../../types/product'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive<IProduct.Root>({
  code: '',
  name: '',
  family: undefined,
  brand: undefined,
  marketing: {
    color: '',
    description: '',
    isPublic: false,
    photo: '',
  },
  taxes: {
    ncm: '',
    cest: '',
  },
  production: {
    formulation: [],
    lost: 0,
  },
  pack: {
    barcodeDun14: '',
    numberOfUnitsInPack: 0,
    numberOfPacksInPallet: 0,
  },
  unit: {
    barcodeEan13: '',
    weight: 0,
  },
  UnitOfMeasurement: '',
})

const loadModel = (data: IProduct.Root) => {
  model.code = data.code
  model.name = data.name
  model.family = data.family
  model.brand = data.brand
  model.marketing = data.marketing
  model.production = data.production
  model.taxes = {
    ncm: data.taxes?.ncm,
    cest: data.taxes?.cest,
  }
  model.pack = {
    barcodeDun14: data.pack.barcodeDun14,
    numberOfUnitsInPack: data.pack.numberOfUnitsInPack,
    numberOfPacksInPallet: data.pack.numberOfPacksInPallet,
  }
  model.unit = {
    barcodeEan13: data.unit.barcodeEan13,
    weight: data.unit.weight,
  }
  model.UnitOfMeasurement = data.UnitOfMeasurement
}

const formatSubmit = (data: IProduct.Root) => {
  return {
    code: data.code,
    name: data.name,
    marketing: data.marketing,
    taxes: data.taxes,
    production: {
      formulation: data.production.formulation.map((item) => {
        return {
          value: Number(item.value),
          feedstock: item.feedstock?._id,
          considerInWeightCalculation: item.considerInWeightCalculation,
        }
      }),
    },
    pack: {
      barcodeDun14: data.pack.barcodeDun14,
      numberOfUnitsInPack: Number(data.pack.numberOfUnitsInPack),
      numberOfPacksInPallet: Number(data.pack.numberOfPacksInPallet),
    },
    unit: {
      barcodeEan13: data.unit.barcodeEan13,
      weight: Number(data.unit.weight),
    },
    UnitOfMeasurement: data.UnitOfMeasurement,
    family: data.family?._id ? data.family._id : undefined,
    brand: data.brand?._id ? data.brand._id : undefined,
  }
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="formatSubmit"
    :create-fn="createProduct"
    :delete-fn="deleteProduct"
    :get-fn="getProduct"
    :update-fn="updateProduct"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-products' })"
  >
    <template #default="{ loading, submit }">
      <RouterView
        :loading="loading"
        :model="model"
        @submit="submit"
      />
    </template>
  </EGenericIdView>
</template>

<route lang="yaml">
path: /produtos/:id
</route>
