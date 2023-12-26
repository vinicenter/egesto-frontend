<script lang="ts" setup>
import type { IPricesTable } from '../types/pricesTable';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PricesTableSummary from './PricesTableSummary.vue';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';

const router = useRouter();
const { displayMessage } = useNotify();

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
}, (errorEvent) => {
  const error = Object.keys(errorEvent.errors)
  const errorMessage = `Verifique os campos do formulário: ${error.join(', ')}`

  displayMessage({
    type: 'error',
    message: errorMessage,
  });
});

const disabled = computed(() => props.loading || props.disabled);

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

const tab = ref('informations')
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

    <VTabs grow class="m-y-4" v-model="tab">
      <VTab value="informations">
        Informações básicas
      </VTab>
      <VTab value="products">
        Produtos
      </VTab>
    </VTabs>

    <VWindow v-model="tab">
      <VWindowItem value="informations">
        <PricesTableFormInformations :disabled="disabled" />
      </VWindowItem>

      <VWindowItem value="products">
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
