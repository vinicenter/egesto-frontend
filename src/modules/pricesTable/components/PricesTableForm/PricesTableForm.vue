<script lang="ts" setup>
import type { IPricesTable, PricesTableFormType } from '../../types/pricesTable';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PricesTableSummary from '../PricesTableSummary.vue';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { useMagicKeys } from '@vueuse/core';
import { watch } from 'vue';

const router = useRouter();
const { displayMessage } = useNotify();

const props = defineProps<{
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues: PricesTableFormType.Root;
}>();

const form = useForm<PricesTableFormType.Root>({
  initialValues: props.initialValues,
})

const emit = defineEmits<{
  (e: 'submit', value: PricesTableFormType.Root): void;
}>();

const submit = form.handleSubmit((values) => {
  emit('submit', values);
}, (errorEvent) => {
  const error = Object.keys(errorEvent.errors)
  const errorMessage = `Verifique os campos do formulário: ${error.join(', ')}`

  displayMessage({
    type: 'error',
    message: errorMessage,
  });
});

const prices = computed(() => form.values.prices);

const disabled = computed(() => props.loading || props.disabled);

const itemsTotal = computed(() => {
  return prices.value.length;
})

const volumeTotal = computed(() => {
  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.volume
      ? acc + Number(price.volume)
      : acc;
  }, 0);
})

const grossRevenue = computed(() => {
  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.grossRevenue
      ? acc + Number(price.grossRevenue)
      : acc;
  }, 0);
})

const totalNetRevenue = computed(() => {
  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.netSales
      ? acc + Number(price.netSales)
      : acc;
  }, 0);
})

const mediumMargin = computed(() => {
  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.margin ?
      acc + Number(price.margin)
      : acc;
  }, 0)/(prices.value.length) || 0;
})

const { ctrl_shift_p } = useMagicKeys()

watch(ctrl_shift_p, (value) => {
  if(!value) return

  const data = form.values

  console.log('We have got some debug data for you:')

  console.log('form', data)
  console.log('data to API', {
    name: data.name,
    archived: data.archived,
    costTable: data.costTable?._id,
    customer: data.customer?._id,
    prices: data.prices.map((price) => ({
      product: price.product._id,
      tax: Number(price.tax),
      shipment: Number(price.shipment),
      expense: Number(price.expense),
      price: Number(price.price),
      volume: Number(price.volume),
      grossRevenue: Number(price.grossRevenue),
      netSales: Number(price.netSales),
      productCost: Number(price.productCost),
      productionLost: Number(price.productionLost),
      margin: Number(price.margin),
    }))
  })
})

const tab = ref('informations')
</script>

<template>
  <form @submit.prevent="submit">
    <PricesTableSummary
      :items="itemsTotal"
      :volumeTotal="volumeTotal"
      :grossRevenue="grossRevenue"
      :totalNetRevenue="totalNetRevenue"
      :mediumMargin="mediumMargin"
    />

    <VTabs grow class="m-y-4" v-model="tab">
      <VTab value="informations">
        Informações básicas
      </VTab>

      <VTab
        value="products"
        :disabled="!form.values.costTable"
      >
        Produtos
      </VTab>
    </VTabs>

    <VWindow v-model="tab" class="p-1">
      <VWindowItem value="informations" eager>
        <PricesTableFormInformations :disabled="disabled" />
      </VWindowItem>

      <VWindowItem value="products" eager>
        <PricesTableFormProducts :disabled="disabled" :form="form" />
      </VWindowItem>
    </VWindow>

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
