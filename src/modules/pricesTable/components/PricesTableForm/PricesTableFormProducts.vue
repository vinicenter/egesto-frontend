

<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { priceFormat } from '@/src/core/utils/format';
import { IPricesTable } from '../../types/pricesTable';
import { FormContext, useFormValues } from 'vee-validate';
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';
import { getProductMargin, getProductPriceByMargin } from '@/src/modules/pricesTable/utils/product-margin';
import { getFamiliesDefaultCost } from '@/src/modules/families/datasource/families';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

const props = defineProps<{
  disabled: boolean;
  form: FormContext<IPricesTable.Root, IPricesTable.Root>;
}>();

const { displayMessage } = useNotify();
const { formatPrice } = priceFormat();

const fields = useFormValues<IPricesTable.Root>();

const {
  data: familiesDefaultCost,
  isLoading: loadingFamiliesDefaultCost
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

const setProductMargin = (price: IPricesTable.Price, index: number) => {
  const { grossRevenue, margin, netSales } = getProductMargin(price)

  props.form.setFieldValue(`prices.${index}.margin`, margin);
  props.form.setFieldValue(`prices.${index}.netSales`, netSales);
  props.form.setFieldValue(`prices.${index}.grossRevenue`, grossRevenue);
}

const setProductPriceByMargin = (price: IPricesTable.Price, index: number) => {
  try {
    const result = getProductPriceByMargin(price)
    
    const priceFormatted = Number(result.price.toFixed(2))
    
    props.form.setFieldValue(`prices.${index}.price`, priceFormatted);
    props.form.setFieldValue(`prices.${index}.margin`, result.margin);
    props.form.setFieldValue(`prices.${index}.netSales`, result.netSales);
    props.form.setFieldValue(`prices.${index}.grossRevenue`, result.grossRevenue);
  } catch (e) {
    const error = e as string;

    displayMessage({
      message: error,
      type: 'error'
    })
  }
}

const setProductDataToPrice = (row: IPricesTable.Price, index: number) => {
  const product = row.product

  const productCost = product?.productionCost?.packCost || 0;
  const expense = product?.family?.totalCosts + familiesDefaultCost.value.totalCosts || 0;
  const productionLost = product?.production?.lost || 0;
  const volume = row.volume || 1;
  const price = row.price || 0;

  const tax = props.form.values.costTable?.taxes.reduce((acc, tax) => {
    return acc + (tax.cost || 0);
  }, 0) || 0;

  const productsIdsShipments = props.form.values.costTable?.shipments.products.map((shipment) => shipment.product?._id) || [];

  const shipment = productsIdsShipments.includes(product._id)
    ? props.form.values.costTable?.shipments.products.find((shipment) => shipment.product._id === product._id)?.cost || 0
    : props.form.values.costTable?.shipments.families.find((shipment) => shipment.family._id === product.family?._id)?.cost || 0;

  props.form.setFieldValue(`prices.${index}.shipment`, shipment);
  props.form.setFieldValue(`prices.${index}.productCost`, productCost);
  props.form.setFieldValue(`prices.${index}.expense`, expense);
  props.form.setFieldValue(`prices.${index}.productionLost`, productionLost);
  props.form.setFieldValue(`prices.${index}.volume`, volume);
  props.form.setFieldValue(`prices.${index}.price`, price);
  props.form.setFieldValue(`prices.${index}.tax`, tax);
}

const syncProduct = (price: IPricesTable.Price, index: number, shouldNotify: boolean) => {
  setProductDataToPrice(price, index);
  setProductMargin(price, index);

  if(shouldNotify) {
    displayMessage({
      message: 'Produto sincronizado com a tabela de preço e família',
      type: 'success'
    })
  }
}

const syncAllProducts = () => {
  fields.value.prices?.forEach((price: IPricesTable.Price, index: number) => syncProduct(price, index, false));

  displayMessage({
    message: 'Produtos sincronizados com a tabela de preço e família',
    type: 'success'
  })
}
</script>

<template>
  <section class="space-y-4">
    <div class="space-x-4">
      <VTooltip
        open-on-click
        location="top"
      >
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="props"
            prepend-icon="mdi-sync"
            :disabled="disabled"
            @click="syncAllProducts"
          >
            Sincronizar produtos
          </VBtn>
        </template>

        <span>Sincronizar custo do produto, tabela de custo e custos da família de todos os produtos</span>
      </VTooltip>

      <PricesTableAddFamily
        :disabled="disabled"
        @load-product-data="setProductDataToPrice"
      />

      <PricesTableBulkChanges
        :disabled="disabled"
        @set-product-margin="setProductMargin"
        @set-product-price-by-margin="setProductPriceByMargin"
      />
    </div>

    <VDivider />

    <EEditableListItem
      name="prices"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-sm"
      :disabled="disabled"
    >
      <template #default="{ removeItem, item, index }">
        <div class="col-span-full flex gap-sm">
          <ESelectProducts
            label="Produto"
            return-object
            :name="`prices.${index}.product`"
            :disabled="disabled"
            :rules="[required]"
            @update:modelValue="setProductDataToPrice(item, index)"
          />

          <PricesTableCostsDetail
            eager
            :disabled="disabled || !item.product"
            :shipment="`prices.${index}.shipment`"
            :tax="`prices.${index}.tax`"
            :expense="`prices.${index}.expense`"
            :productionLost="`prices.${index}.productionLost`"
            @updated="setProductMargin(item, index)"
          />

          <VTooltip open-on-click>
            <template v-slot:activator="{ props }">
              <VBtn
                v-bind="props" 
                icon="mdi-sync"
                :disabled="disabled || !item.product"
                @click="syncProduct(item, index, true)"
              />
            </template>

            <span>Sincronizar custo do produto, tabela de custo e custos da família</span>
          </VTooltip>

          <VBtn
            color="red"
            icon="mdi-trash-can"
            :disabled="disabled"
            @click="removeItem"
          />
        </div>

        <EInputPrice
          :name="`prices.${index}.price`"
          :rules="[required]"
          :disabled="disabled || !item.product"
          label="Preço de venda"
          @update:model-value="setProductMargin(item, index)"
        />

        <EInputText
          :name="`prices.${index}.volume`"
          :rules="[required]"
          :disabled="disabled || !item.product"
          type="number" label="Volume"
          @update:model-value="setProductMargin(item, index)"
        />

        <EInputPrice
          :name="`prices.${index}.productCost`"
          :rules="[required]" :disabled="disabled || !item.product"
          label="Custo do produto"
          @update:model-value="setProductMargin(item, index)"
        />

        <EInputPct
          :name="`prices.${index}.margin`"
          :rules="[required]"
          :disabled="disabled || !item.product"
          label="Margem (%)"
          @blur="setProductPriceByMargin(item, index)"
        />

        <div class="flex flex-col gap-x-sm">
          <div>{{ formatFamilyLabel(item.product?.family) }}</div>
          <div>Fat. liquido: {{ formatPrice(item.netSales) }}</div>
          <div>Fat. bruto: {{ formatPrice(item.grossRevenue) }}</div>
        </div>
      </template>
    </EEditableListItem>
  </section>
</template>
