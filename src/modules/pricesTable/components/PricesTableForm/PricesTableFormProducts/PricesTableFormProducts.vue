<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { PricesTableFormType } from '../../../types/pricesTable';
import { FormContext, useFieldArray } from 'vee-validate';
import { getProductMargin, getProductPriceByMargin } from '@/src/modules/pricesTable/utils/product-margin';
import { getFamiliesDefaultCost } from '@/src/modules/families/datasource/families';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { nextTick } from 'vue';
import PricesTableProductsTable from './PricesTableProductsTable.vue';
import { reactive } from 'vue';

const props = defineProps<{
  disabled: boolean;
  form: FormContext<PricesTableFormType.Root, PricesTableFormType.Root>;
}>();

const { displayMessage } = useNotify();

const { fields: prices, remove } = useFieldArray<PricesTableFormType.Price>('prices');

const {
  data: familiesDefaultCost,
  isLoading: loadingFamiliesDefaultCost,
} = useQuery({
  queryKey: [ 'families-default-costs' ],
  queryFn: getFamiliesDefaultCost,
  onError: () => {
    displayMessage({
      message: 'Erro ao buscar custos padrões das famílias',
      type: 'error'
    })
  }
})

const disabled = computed(() => props.disabled || loadingFamiliesDefaultCost.value)

const setProductMargin = async (indexPrice: number) => {
  await nextTick()

  const price = prices.value[indexPrice].value

  const { grossRevenue, margin, netSales } = getProductMargin(price)

  props.form.setFieldValue(`prices.${indexPrice}.margin`, margin);
  props.form.setFieldValue(`prices.${indexPrice}.netSales`, netSales);
  props.form.setFieldValue(`prices.${indexPrice}.grossRevenue`, grossRevenue);
}

const setProductPrice = (indexPrice: number) => {
  try {
    const price = prices.value[indexPrice].value

    const result = getProductPriceByMargin(price)

    const priceFormatted = Number(result.price.toFixed(2))

    props.form.setFieldValue(`prices.${indexPrice}.price`, priceFormatted);
    props.form.setFieldValue(`prices.${indexPrice}.margin`, result.margin);
    props.form.setFieldValue(`prices.${indexPrice}.netSales`, result.netSales);
    props.form.setFieldValue(`prices.${indexPrice}.grossRevenue`, result.grossRevenue);
  } catch (e) {
    const error = e as string;

    displayMessage({
      message: error,
      type: 'error'
    })
  }
}

const setProductDataToPrice = (indexPrice: number) => {
  const row = prices.value[indexPrice].value

  const product = row.product

  const productCost = product?.productionCost?.packCost || 0;
  const expense = (product?.family?.totalCosts + (familiesDefaultCost.value.totalCosts || 0) + (props.form.values.customer?.contractExpenses || 0)) || 0;
  const productionLost = product?.production?.lost || 0;
  const volume = row.volume || 1;
  const price = row.price || 0;

  const tax = props.form.values.costTable?.taxes.reduce((acc, tax) => {
    return acc + (tax.cost || 0);
  }, 0) || 0;

  const productsIdsShipments = props.form.values.costTable?.shipments.products.map((shipment) => shipment.product?._id) || [];

  const shipmentFromCostTableEntries = (productsIdsShipments.includes(product._id)
    ? props.form.values.costTable?.shipments.products.find((shipment) => shipment.product._id === product._id)?.cost
    : props.form.values.costTable?.shipments.families.find((shipment) => shipment.family._id === product.family?._id)?.cost)

  const shipmentForNotDefinedRegisters = props.form.values.costTable?.defaultShipmentCost

  const shipment = shipmentFromCostTableEntries || shipmentForNotDefinedRegisters || 0

  props.form.setFieldValue(`prices.${indexPrice}.shipment`, shipment);
  props.form.setFieldValue(`prices.${indexPrice}.productCost`, productCost);
  props.form.setFieldValue(`prices.${indexPrice}.expense`, expense);
  props.form.setFieldValue(`prices.${indexPrice}.productionLost`, productionLost);
  props.form.setFieldValue(`prices.${indexPrice}.volume`, volume);
  props.form.setFieldValue(`prices.${indexPrice}.price`, price);
  props.form.setFieldValue(`prices.${indexPrice}.tax`, tax);
}

const syncProduct = (indexPrice: number, shouldNotify: boolean) => {
  setProductDataToPrice(indexPrice);
  setProductMargin(indexPrice);

  if(shouldNotify) {
    displayMessage({
      message: 'Produto sincronizado com a tabela de preço e família',
      type: 'success'
    })
  }
}

const getPriceIndexByProductId = (productId?: string) => {
  return prices.value.findIndex(item => item.value.product._id! === productId)
}

const filterValues = reactive<{
  families: string[]
  search: string
}>({
  families: [],
  search: ''
})

const itemsFiltered = computed(() => {
  const pricesFamiliesFiltered = filterValues.families.length
    ? prices.value.filter((price) => {
        return filterValues.families.includes(price.value.product?.family?._id as string)
      })
    : prices.value

  const pricesSearchFiltered = filterValues.search
    ? pricesFamiliesFiltered.filter((price) => {
        return price.value.product.name.toLowerCase().includes(filterValues.search.toLowerCase())
      })
    : pricesFamiliesFiltered

  return pricesSearchFiltered
})

const syncAllFilterdItems = () => {
  itemsFiltered.value.map((items) => items.value).forEach(async (price) => {
    const id = price.product._id

    syncProduct(getPriceIndexByProductId(id), false)

    await nextTick()
  })

  displayMessage({
    message: 'Produtos sincronizados com a tabela de preço e família',
    type: 'success'
  })
}

const removeAllFilteredItems = () => {
  itemsFiltered.value.map((items) => items.value).forEach(async (price) => {
    const id = price.product._id

    remove(getPriceIndexByProductId(id))

    await nextTick()
  })

  displayMessage({
    message: 'Produtos removidos',
    type: 'success'
  })
}

const setFilters = (values: typeof filterValues) => {
  Object.assign(filterValues, values)
}
</script>

<template>
  <section class="space-y-4">
    <PricesTableFilter
      :disabled="disabled"
      @filter="setFilters"
    />

    <div class="flex flex-wrap gap-sm items-center">
      <PricesTableAdd
        :disabled="disabled"
        @set-product-data-to-price="setProductDataToPrice"
      />

      <PricesTableBulkChanges
        :items-filtered="itemsFiltered"
        :disabled="disabled"
        @set-product-price="setProductPrice"
        @set-product-margin="setProductMargin"
      />

      <PricesTableSync
        tooltip-text="Sincronizar custo do produto, tabela de custo e custos da família dos itens filtrados"
        @confirm="syncAllFilterdItems"
        :disabled="disabled"
      />

      <PricesTableRemove
        :tooltip-text="`Remover todos os itens filtrados`"
        :disabled="disabled"
        @confirm="removeAllFilteredItems"
      />
    </div>

    <PricesTableProductsTable
      :disabled="disabled"
      :items-filtered="itemsFiltered"
      @set-product-margin="setProductMargin"
      @set-product-price="setProductPrice"
      @sync-product="syncProduct"
      @remove="remove"
    />
  </section>
</template>
