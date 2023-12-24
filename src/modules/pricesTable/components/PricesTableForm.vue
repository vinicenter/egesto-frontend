<script lang="ts" setup>
// import EEditableListItem from '@/src/core/components/EInput/EEditableListItem.vue';
import type { IPricesTable } from '../types/pricesTable';
import { required } from '@/src/core/utils/form-validator';
import { computed } from 'vue';
import { toRef } from 'vue';
import { useRouter } from 'vue-router';
// import ESelectProducts from '@/src/core/components/ESelect/ESelectProducts.vue';
import useNotify from '@/src/core/composables/useNotify';
import PricesTableSummary from './PricesTableSummary.vue';
// import { priceFormat } from '@/src/core/utils/format';

const router = useRouter();
const { displayMessage } = useNotify();
// const { formatPrice } = priceFormat();

const props = defineProps<{
  model: IPricesTable.Root;
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const model = toRef(props, 'model');
const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);

const setProductMargin = (row: IPricesTable.Root['prices'][0]) => {
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

  row.margin = Number((((netRevenue - expensesVariables - productCost - lost)/totalRevenue)*100).toPrecision(5));
  row.netSales = netRevenue;
  row.grossRevenue = totalRevenue;
}

const setProductDataToPrice = (row: IPricesTable.Root['prices'][0]) => {
  const product = row.product

  row.productCost = product?.production?.cost?.packCost || 0;
  row.expense = product.family?.totalCosts || 0;
  row.productionLost = product?.production?.lost || 0;
  row.volume = row.volume || 1;
  row.price = row.price || 0;

  row.tax = model.value.costTable?.taxes.reduce((acc, tax) => {
    return acc + (tax.cost || 0);
  }, 0) || 0;

  const productsIdsShipments = model.value.costTable?.shipments.products.map((shipment) => shipment.product?._id) || [];

  if(productsIdsShipments.includes(product._id)) {
    row.shipment = model.value.costTable?.shipments.products.find((shipment) => shipment.product._id === product._id)?.cost || 0;
  } else {
    row.shipment = model.value.costTable?.shipments.families.find((shipment) => shipment.family._id === product.family?._id)?.cost || 0;
  }
}

const syncAllProducts = () => {
  model.value.prices.forEach((price) => {
    setProductDataToPrice(price);
    setProductMargin(price);
  });

  displayMessage({ 
    message: 'Produtos sincronizados com a tabela de preço e família',
    type: 'success'
  })
}

const volumeTotal = computed(() => {
  return model.value.prices.reduce((acc, price) => {
    return price.netSales
      ? acc + Number(price.volume)
      : acc;
  }, 0);
})

const grossRevenue = computed(() => {
  return model.value.prices.reduce((acc, price) => {
    return price.grossRevenue
      ? acc + Number(price.grossRevenue)
      : acc;
  }, 0);
})

const totalNetRevenue = computed(() => {
  return model.value.prices.reduce((acc, price) => {
    return price.netSales
      ? acc + Number(price.netSales)
      : acc;
  }, 0);
})

const mediumMargin = computed(() => {
  return model.value.prices.reduce((acc, price) => {
    return price.margin ?
      acc + Number(price.margin)
      : acc;
  }, 0)/(model.value.prices.length) || 0;
})
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <PricesTableSummary
      class="m-y-sm"
      :volumeTotal="volumeTotal"
      :grossRevenue="grossRevenue"
      :totalNetRevenue="totalNetRevenue"
      :mediumMargin="mediumMargin"
    />

    <VDivider class="m-y-sm" />

    <section>
      <VTextField
        :disabled="disabled"
        v-model="model.name"
        label="Nome"
        :rules="[required]"
      />

      <ESelectCostsTable
        :disabled="disabled"
        v-model="model.costTable"
        return-object
        :rules="[required]"
      />

      <ESelectPeople
        :disabled="disabled"
        v-model="model.customer"
        return-object
        label="Cliente"
      />

      <div class="flex items-left">
        <VSwitch
          :disabled="disabled"
          v-model="model.archived"
          label="Arquivar"
          class="w-100px"
        />

        <VTooltip>
          <template v-slot:activator="{ props }">
            <VBtn @click="syncAllProducts" v-bind="props" icon="mdi-sync" />
          </template>
          <span>Sincronizar produtos com tabela de custo e familia</span>
        </VTooltip>
      </div>

      <VDivider class="m-y-sm" />

      <!-- <EEditableListItem
        v-model="model.prices"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-sm"
        :disabled="disabled"
      >
        <template #default="{ removeItem, item }">
          <div class="col-span-full flex gap-sm">
            <ESelectProducts
              v-model="item.product"
              :disabled="disabled"
              :rules="[required]"
              label="Produto"
              @update:model-value="setProductDataToPrice(item)"
              return-object
            />

            <VBtn 
              :disabled="disabled"
              color="red"
              @click="removeItem"
              icon="mdi-trash-can"
            />

            <PricesTableCostsDetail
              v-model:shipment="item.shipment"
              v-model:tax="item.tax"
              v-model:expense="item.expense"
              v-model:productionLost="item.productionLost"
              @update:shipment="setProductMargin(item)"
              @update:tax="setProductMargin(item)"
              @update:expense="setProductMargin(item)"
              @update:productionLost="setProductMargin(item)"
            />
          </div>

          <EInputPrice
            v-model="item.price"
            :rules="[required]"
            :disabled="disabled"
            @update:model-value="setProductMargin(item)"
            label="Preço de venda"
          />

          <VTextField
            v-model="item.volume"
            :rules="[required]"
            :disabled="disabled"
            @update:model-value="setProductMargin(item)"
            type="number"
            label="Volume"
          />

          <EInputPct
            v-model="item.margin"
            :rules="[required]"
            :disabled="disabled"
            label="Margem (%)"
          />

          <div class="flex flex-col gap-x-sm">
            <div>Família: {{ item.product?.family?.name }}</div>
            <div>Custo: {{ formatPrice(item.productCost) }}</div>
            <div>Fat. liquido: {{ formatPrice(item.netSales) }}</div>
            <div>Fat. bruto: {{ formatPrice(item.grossRevenue) }}</div>
          </div>
        </template>
      </EEditableListItem> -->
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
  </EForm>
</template>
