<script lang="ts" setup>
import EEditableListItem from '@/src/core/components/EInput/EEditableListItem.vue';
import type { IPricesTable } from '../types/pricesTable';
import { required } from '@/src/core/utils/form-validator';
import { computed } from 'vue';
import { toRef } from 'vue';
import { useRouter } from 'vue-router';
import ESelectProducts from '@/src/core/components/ESelect/ESelectProducts.vue';
import { IProduct } from '../../products/types/product';

const router = useRouter();

const props = defineProps<{
  model: IPricesTable.Root;
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const model = toRef(props, 'model');
const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);

const setProductDataToPrice = (product: IProduct.Root, row: IPricesTable.Root['prices'][0]) => {
  row.productCost = product.production?.cost?.packCost || 0;
  row.expense = product.family?.totalCosts || 0;
  row.productionLost = product?.production?.lost || 0;
  row.volume = 1;

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
</script>

<template>
  <EForm @submit="emit('submit', $event)">
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

      <VSwitch
        :disabled="disabled"
        v-model="model.archived"
        label="Arquivar"
      />

      <VDivider class="m-b-sm" />

      <EEditableListItem
        v-model="model.prices"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm"
        :disabled="disabled"
      >
        <template #default="{ removeItem, item }">
          <div class="col-span-full">
            <ESelectProducts
              v-model="item.product"
              :disabled="disabled"
              :rules="[required]"
              label="Produto"
              @update:model-value="setProductDataToPrice($event, item)"
              return-object
            />
          </div>

          <EInputPrice
            v-model="item.price"
            :rules="[required]"
            :disabled="disabled"
            label="Preço de venda"
          />

          <VTextField
            v-model="item.volume"
            :rules="[required]"
            :disabled="disabled"
            type="number"
            label="Volume"
          />

          <EInputPrice
            v-model="item.productCost"
            :rules="[required]"
            :disabled="disabled"
            label="Custo do produto"
          />

          <EInputPct
            v-model="item.shipment"
            :rules="[required]"
            :disabled="disabled"
            label="Frete (%)"
          />

          <EInputPct
            v-model="item.expense"
            :rules="[required]"
            :disabled="disabled"
            label="Despesas (%)"
          />

          <EInputPct
            v-model="item.productionLost"
            :rules="[required]"
            :disabled="disabled"
            label="Perdas de produção (%)"
          />

          <EInputPct
            v-model="item.tax"
            :rules="[required]"
            :disabled="disabled"
            label="Impostos (%)"
          />

          <div class="flex gap-x-sm">
            <EInputPct
              v-model="item.price"
              :rules="[required]"
              :disabled="disabled"
              label="Margem (%)"
            />

            <VBtn 
              :disabled="disabled"
              color="red"
              @click="removeItem"
              icon="mdi-trash-can"
            />

            <div>Faturamento liquido: {{ item.netSales }}</div>
            <div>Faturamento bruto: {{ item.grossRevenue }}</div>
          </div>
        </template>
      </EEditableListItem>
    </section>

    <VDivider class="m-b-sm" />

    <section class="grid grid-cols-4 gap-x-sm">
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