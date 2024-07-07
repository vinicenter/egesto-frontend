<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { required } from '@/src/core/utils/form-validator';
import { BILL_PAYMENT_METHOD } from '../../constants/bills';
import { IBillInstallmentForm } from '../../types/bill-installment';
import { priceFormat } from '@/src/core/utils/format';

const tab = ref<'info' | 'portions'>('info')

const router = useRouter();
const { formatPrice } = priceFormat({
  minimumFractionDigits: 2,
});

const props = defineProps<{
  initialValues: IBillInstallmentForm;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const form = useForm<IBillInstallmentForm>({
  initialValues: props.initialValues,
})

const disabled = computed(() => props.loading || props.disabled);

const submit = form.handleSubmit(async (values) => {
  emit('submit', values);
});

const totalValue = computed(() => {
  return formatPrice(form.values.bills.reduce((acc, bill) => acc + Number(bill.amount || 0), 0))
})
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <EInputText
          name="name"
          :disabled="disabled"
          label="Nome"
          :rules="[required]"
        />

        <ESelect
          :items="BILL_PAYMENT_METHOD"
          :return-object="false"
          item-title="label"
          item-value="value"
          label="Forma de pagamento"
          name="paymentMethod"
          :rules="[required]"
          :disabled="disabled"
          clearable
        />

        <div>
          Valor total: {{ totalValue }}
        </div>
      </div>

      <VDivider class="m-b-sm" />

      <VTabs grow v-model="tab">
        <VTab value="info">
          Informações
        </VTab>
        <VTab value="portions">
          Parcelas
        </VTab>
      </VTabs>
  
      <VWindow v-model="tab">
        <VWindowItem value="info" class="m-t-sm" eager>
          <InstallmentFormInfo :disabled="disabled" />
        </VWindowItem>
  
        <VWindowItem value="portions" class="m-t-sm" eager>
          <InstallmentFormPortions :disabled="disabled" />
        </VWindowItem>
      </VWindow>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-sm">
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
        @click="router.push({ name: 'list-bills' })"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </div>
  </form>
</template>