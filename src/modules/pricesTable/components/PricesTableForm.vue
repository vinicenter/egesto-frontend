<script lang="ts" setup>
import EEditableListItem from '@/src/core/components/EInput/EEditableListItem.vue';
import type { IPricesTable } from '../types/pricesTable';
import { required } from '@/src/core/utils/form-validator';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ESelectProducts from '@/src/core/components/ESelect/ESelectProducts.vue';
import useNotify from '@/src/core/composables/useNotify';
import PricesTableSummary from './PricesTableSummary.vue';
import { useForm } from 'vee-validate';
import { priceFormat } from '@/src/core/utils/format';
import EInputText from '@/src/core/components/EInput/EInputText.vue';

const router = useRouter();
const { displayMessage } = useNotify();
const { formatPrice } = priceFormat();

const props = defineProps<{
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues: IPricesTable.Root;
}>();

const form = useForm<IPricesTable.Root>({
  initialValues: props.initialValues,
})

const emit = defineEmits<{
  (e: 'submit', value: IPricesTable.Root): void;
}>();

const submit = form.handleSubmit((values) => {
  emit('submit', values);
})

const disabled = computed(() => props.loading || props.disabled);

const setProductMargin = (row: IPricesTable.Root['prices'][0], index: number) => {
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

  form.setFieldValue(`prices.${index}.margin`, margin);
  form.setFieldValue(`prices.${index}.netSales`, netSales);
  form.setFieldValue(`prices.${index}.grossRevenue`, grossRevenue);
}

const setProductDataToPrice = (row: IPricesTable.Root['prices'][0], index: number) => {
  const product = row.product

  const productCost = product?.productionCost?.packCost || 0;
  const expense = product?.family?.totalCosts || 0;
  const productionLost = product?.production?.lost || 0;
  const volume = row.volume || 1;
  const price = row.price || 0;

  const tax = form.values.costTable?.taxes.reduce((acc, tax) => {
    return acc + (tax.cost || 0);
  }, 0) || 0;

  const productsIdsShipments = form.values.costTable?.shipments.products.map((shipment) => shipment.product?._id) || [];

  const shipment = productsIdsShipments.includes(product._id)
    ? form.values.costTable?.shipments.products.find((shipment) => shipment.product._id === product._id)?.cost || 0
    : form.values.costTable?.shipments.families.find((shipment) => shipment.family._id === product.family?._id)?.cost || 0;

  form.setFieldValue(`prices.${index}.shipment`, shipment);
  form.setFieldValue(`prices.${index}.productCost`, productCost);
  form.setFieldValue(`prices.${index}.expense`, expense);
  form.setFieldValue(`prices.${index}.productionLost`, productionLost);
  form.setFieldValue(`prices.${index}.volume`, volume);
  form.setFieldValue(`prices.${index}.price`, price);
  form.setFieldValue(`prices.${index}.tax`, tax);
}

const syncProduct = (price: IPricesTable.Root['prices'][0], index: number) => {
  setProductDataToPrice(price, index);
  setProductMargin(price, index);
}

const syncAllProducts = () => {
  form.values.prices.forEach((price, index) => syncProduct(price, index));

  displayMessage({ 
    message: 'Produtos sincronizados com a tabela de preço e família',
    type: 'success'
  })
}

const volumeTotal = computed(() => {
  return form.values.prices.reduce((acc, price) => {
    return price.netSales
      ? acc + Number(price.volume)
      : acc;
  }, 0);
})

const grossRevenue = computed(() => {
  return form.values.prices.reduce((acc, price) => {
    return price.grossRevenue
      ? acc + Number(price.grossRevenue)
      : acc;
  }, 0);
})

const totalNetRevenue = computed(() => {
  return form.values.prices.reduce((acc, price) => {
    return price.netSales
      ? acc + Number(price.netSales)
      : acc;
  }, 0);
})

const mediumMargin = computed(() => {
  return form.values.prices.reduce((acc, price) => {
    return price.margin ?
      acc + Number(price.margin)
      : acc;
  }, 0)/(form.values.prices.length) || 0;
})
</script>

<template>
  <form @submit.prevent="submit">
    <PricesTableSummary
      class="m-y-sm"
      :volumeTotal="volumeTotal"
      :grossRevenue="grossRevenue"
      :totalNetRevenue="totalNetRevenue"
      :mediumMargin="mediumMargin"
    />

    <VDivider class="m-y-sm" />

    <section>
      <EInputText
        name="name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <ESelectCostsTable
        name="costTable"
        :disabled="disabled"
        return-object
        :rules="[required]"
      />

      <ESelectPeople
        name="customer"
        :disabled="disabled"
        return-object
        label="Cliente"
      />

      <div class="flex items-left">
        <ESwitch
          name="archived"
          :disabled="disabled"
          label="Arquivar"
          class="w-100px"
        />

        <VTooltip>
          <template v-slot:activator="{ props }">
            <VBtn @click="syncAllProducts" v-bind="props" icon="mdi-sync" />
          </template>
          <span>Sincronizar custo do produto, tabela de custo e custos da família de todos os produtos</span>
        </VTooltip>
      </div>

      <VDivider class="m-y-sm" />

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

    <VDivider class="m-y-sm" />

    <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-sm">
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
        @click="router.push({ name: 'list-prices-table' })"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </section>
  </form>
</template>
