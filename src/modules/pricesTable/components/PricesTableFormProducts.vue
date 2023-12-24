

<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { priceFormat } from '@/src/core/utils/format';
import { IPricesTable } from '../types/pricesTable';
import { FormContext, useFormValues } from 'vee-validate';

const props = defineProps<{
  disabled: boolean;
  form: FormContext<IPricesTable.Root, IPricesTable.Root>;
}>();

const { displayMessage } = useNotify();
const { formatPrice } = priceFormat();

const fields = useFormValues();

const setProductMargin = (row: IPricesTable.Product, index: number) => {
  const volume = row.volume;
  const price = Number(row.price);
  const shipment = row.shipment/100;
  const tax = row.tax/100;
  const expense = row.expense/100;
  const productionLost = row.productionLost/100;
  const productCost = row.productCost*volume;

  const totalRevenue = volume * price;
  const shipmentValue = shipment * totalRevenue;
  const unitTotal = totalRevenue-shipmentValue;
  const taxes = tax * unitTotal;

  const netRevenue = unitTotal - taxes;
  const expensesVariables = expense*totalRevenue;
  const lost = productionLost*totalRevenue;

  const margin = Number((((netRevenue - expensesVariables - productCost - lost)/totalRevenue)*100).toPrecision(5));
  const netSales = netRevenue;
  const grossRevenue = totalRevenue;

  props.form.setFieldValue(`prices.${index}.margin`, margin);
  props.form.setFieldValue(`prices.${index}.netSales`, netSales);
  props.form.setFieldValue(`prices.${index}.grossRevenue`, grossRevenue);
}

const setProductDataToPrice = (row: IPricesTable.Product, index: number) => {
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

const syncProduct = (price: IPricesTable.Product, index: number) => {
  setProductDataToPrice(price, index);
  setProductMargin(price, index);
}

const syncAllProducts = () => {
  fields.value.prices.forEach((price: IPricesTable.Product, index: number) => syncProduct(price, index));

  displayMessage({ 
    message: 'Produtos sincronizados com a tabela de preço e família',
    type: 'success'
  })
}
</script>

<template>
  <section>
    <VTooltip>
      <template v-slot:activator="{ props }">
        <VBtn @click="syncAllProducts" v-bind="props" icon="mdi-sync" />
      </template>
      <span>Sincronizar custo do produto, tabela de custo e custos da família de todos os produtos</span>
    </VTooltip>

    <EEditableListItem
      name="prices"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-sm"
      :disabled="disabled"
    >
      <template #default="{ removeItem, item, index }">
        <div class="col-span-full flex gap-sm">
          <ESelectProducts
            :name="`prices.${index}.product`"
            :disabled="disabled"
            :rules="[required]"
            label="Produto"
            return-object
            @update:modelValue="setProductDataToPrice(item, index)"
          />
  
          <VBtn 
            :disabled="disabled"
            color="red"
            @click="removeItem"
            icon="mdi-trash-can"
          />
  
          <PricesTableCostsDetail
            eager
            :disabled="disabled"
            :shipment="`prices.${index}.shipment`"
            :tax="`prices.${index}.tax`"
            :expense="`prices.${index}.expense`"
            :productionLost="`prices.${index}.productionLost`"
          />
  
          <VTooltip>
            <template v-slot:activator="{ props }">
              <VBtn @click="syncProduct(item, index)" v-bind="props" icon="mdi-sync" />
            </template>
            <span>Sincronizar custo do produto, tabela de custo e custos da família</span>
          </VTooltip>
        </div>
  
        <EInputPrice
          :name="`prices.${index}.price`"
          :rules="[required]"
          :disabled="disabled"
          label="Preço de venda"
          @update:model-value="setProductMargin(item, index)"
        />
  
        <EInputText
          :name="`prices.${index}.volume`"
          :rules="[required]"
          :disabled="disabled"
          type="number"
          label="Volume"
          @update:model-value="setProductMargin(item, index)"
        />
  
        <EInputPrice
          :name="`prices.${index}.productCost`"
          :rules="[required]"
          :disabled="disabled"
          label="Custo do produto"
          @update:model-value="setProductMargin(item, index)"
        />
  
        <EInputPct
          :name="`prices.${index}.margin`"
          :rules="[required]"
          :disabled="disabled"
          label="Margem (%)"
        />
  
        <div class="flex flex-col gap-x-sm">
          <div>Família: {{ item.product?.family?.name }}</div>
          <div>Fat. liquido: {{ formatPrice(item.netSales) }}</div>
          <div>Fat. bruto: {{ formatPrice(item.grossRevenue) }}</div>
        </div>
      </template>
    </EEditableListItem>
  </section>
</template>