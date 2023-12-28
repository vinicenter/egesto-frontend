

<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { priceFormat } from '@/src/core/utils/format';
import { IPricesTable } from '../../types/pricesTable';
import { FormContext, useFormValues } from 'vee-validate';
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';

const props = defineProps<{
  disabled: boolean;
  form: FormContext<IPricesTable.Root, IPricesTable.Root>;
}>();

const { displayMessage } = useNotify();
const { formatPrice } = priceFormat();

const fields = useFormValues<IPricesTable.Root>();

const setProductMargin = (row: IPricesTable.Price, index: number) => {
  const volume = row.volume;
  const price = Number(row.price);
  const shipment = row.shipment / 100;
  const tax = row.tax / 100;
  const expense = row.expense / 100;
  const productionLost = row.productionLost / 100;
  const productCost = row.productCost * volume;

  const totalRevenue = volume * price;
  const shipmentValue = shipment * totalRevenue;
  const unitTotal = totalRevenue - shipmentValue;
  const taxes = tax * totalRevenue;

  const netRevenue = unitTotal - taxes;
  const expensesVariables = expense * totalRevenue;
  const lost = productionLost * totalRevenue;

  const margin = Number((((netRevenue - expensesVariables - productCost - lost) / totalRevenue) * 100).toPrecision(5));
  const netSales = netRevenue;
  const grossRevenue = totalRevenue;

  props.form.setFieldValue(`prices.${index}.margin`, margin);
  props.form.setFieldValue(`prices.${index}.netSales`, netSales);
  props.form.setFieldValue(`prices.${index}.grossRevenue`, grossRevenue);
}

const setProductPriceByMargin = (row: IPricesTable.Price, index: number) => {
  // Calculate total revenue with an estimated price (can be improved for accuracy)
  const estimatedPrice = 1 // Use a placeholder value or previous price if available
  const volume = row.volume;
  const shipment = row.shipment / 100;
  const tax = row.tax / 100;
  const expense = row.expense / 100;
  const productionLost = row.productionLost / 100;
  const productCost = row.productCost * volume;

  const totalRevenue = volume * estimatedPrice;

  const desiredMargin = row.margin / 100

  // Calculate other cost and revenue components
  const expensesVariables = expense * totalRevenue
  const lostValue = productionLost * totalRevenue

  // Solve for the price that achieves the desired margin
  const price = (productCost + lostValue + expensesVariables + (totalRevenue * desiredMargin / 100)) / (volume * (1 - shipment - tax - expense - productionLost))

  // Set field values
  props.form.setFieldValue(`prices.${index}.price`, price);
  props.form.setFieldValue(`prices.${index}.margin`, desiredMargin * 100);
}

const setProductDataToPrice = (row: IPricesTable.Price, index: number) => {
  const product = row.product

  const productCost = product?.productionCost?.packCost || 0;
  const expense = product?.family?.totalCosts || 0;
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

      <VTooltip
        open-on-click
        location="top"
      >
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="props"
            prepend-icon="mdi-pencil-outline"
            :disabled="disabled"
          >
            Alterações em massa
          </VBtn>
        </template>

        <span>Faça alterações em massa em uma família especifica ou em todos os produtos da tabela de preço</span>
      </VTooltip>
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
          @update:model-value="setProductPriceByMargin(item, index)"
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
