<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createProduct, deleteProduct, getProduct, updateProduct } from '../../datasource/products';
import { IProduct } from '../../types/product'

const router = useRouter();

defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const initialValuesCreate: IProduct.Root = {
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
}

const formatSubmit = (data: IProduct.Root) => {
  return {
    code: data.code,
    name: data.name,
    marketing: data.marketing,
    taxes: data.taxes,
    production: {
      lost: Number(data.production.lost),
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
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getProduct"
    :delete-fn="deleteProduct"
    :create-fn="createProduct"
    :update-fn="updateProduct"
    :format-submit-fn="formatSubmit"
    :initial-values-create="initialValuesCreate"
    @finish="router.push({ name: 'list-products' })"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <ProductForm
        :initialValues="data"
        :button-label="buttonLabel"
        :loading="loadingSubmit"
        :disabled="type === 'deletar'"
        @submit="submit"
      />
    </template>
  </EGenericIdForm>
</template>

<route lang="yaml">
name: product
path: /produtos/:id/:type
meta:
  title: Produto
</route>
