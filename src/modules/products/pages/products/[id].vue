<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createProduct, deleteProduct, getProduct, updateProduct } from '../../datasource/products';
import { IProduct } from '../../types/product'
import { useQueryClient } from '@tanstack/vue-query';

const router = useRouter();

const props = defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const initialValuesCreate: IProduct.Root = {
  code: '',
  name: '',
  family: undefined,
  brand: undefined,
  price: 0,
  marketing: {
    color: '',
    description: '',
    isPublic: false,
    photos: [],
  },
  taxes: {
    ncm: '',
    cest: '',
  },
  production: {
    formulation: {
      products: [],
      feedstocks: [],
    },
    canBeFeedstock: false,
    lost: 0,
    useCustomPackCostMultiplier: 0,
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
  const isSelectUndefined = (props.type === 'criar' || props.type === 'clonar')

  const family = isSelectUndefined
    ? data.family?._id ? data.family._id : undefined
    : data.family?._id ? data.family._id : null

  const brand = isSelectUndefined
    ? data.brand?._id ? data.brand._id : undefined
    : data.brand?._id ? data.brand._id : null

  return {
    code: data.code,
    name: data.name,
    marketing: {
      ...data.marketing,
      photos: data.marketing.photos?.filter((item) => !!item),
    },
    taxes: data.taxes,
    production: {
      lost: Number(data.production.lost),
      useCustomPackCostMultiplier: Number(data.production.useCustomPackCostMultiplier),
      canBeFeedstock: data.production.canBeFeedstock,
      formulation: {
        products: !data.production.canBeFeedstock ? data.production.formulation.products.map((item) => {
          return {
            value: Number(item.value),
            product: item.product?._id,
            considerInWeightCalculation: item.considerInWeightCalculation,
            considerInVolumeProduced: item.considerInVolumeProduced,
          }
        }) : [],
        feedstocks: data.production.formulation.feedstocks.map((item) => {
          return {
            value: Number(item.value),
            feedstock: item.feedstock?._id,
            considerInWeightCalculation: item.considerInWeightCalculation,
            considerInVolumeProduced: item.considerInVolumeProduced,
          }
        }),
      },
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
    family: family,
    brand: brand,
    sizes: data.sizes ? data.sizes.map((item) => {
      return item._id
    }) : [],
    price: Number(data.price || 0),
  }
}

const formatInitialValues = (data: IProduct.Root): IProduct.Root => {
  return {
    ...data,
    _id: props.type === 'clonar'
      ? undefined
      : data._id,
    code: props.type === 'clonar'
      ? ''
      : data.code,
  }
}

const queryClient = useQueryClient()

const finish = () => {
  queryClient.invalidateQueries(['products'])
  router.push({ name: 'list-products' })
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
    :format-initial-values="formatInitialValues"
    @finish="finish"
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
