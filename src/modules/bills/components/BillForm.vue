<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IBill } from '../types/bill';
import { required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import ESelectPeople from '@/src/core/components/ESelect/ESelectPeople.vue';
import ESwitch from '@/src/core/components/EInput/ESwitch.vue';
import { BILL_PAYMENT_METHOD } from '@/src/modules/bills/constants/bills';

const router = useRouter();

const props = defineProps<{
  initialValues: IBill;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const form = useForm<IBill>({
  initialValues: props.initialValues,
})

const disabled = computed(() => props.loading || props.disabled);

const submit = form.handleSubmit(async (values) => {
  emit('submit', values);
});
</script>

<template>
  <VEmptyState
    v-if="initialValues.installment"
    title="Conta parcelada"
    text="Não é possível editar uma conta parcelada."
    @click:action="router.push({ name: 'list-bills' })"
    action-text="Contas"
  />

  <form v-else @submit.prevent="submit">
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <EDatePicker
          name="dueDate"
          :disabled="disabled"
          label="Data de vencimento"
          :rules="[required]"
        />

        <ESelectPeople
          name="recipient"
          label="Recebedor"
          :disabled="disabled"
          return-object
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

        <EInputPrice
          name="amount"
          :disabled="disabled"
          label="Valor da conta"
          :rules="[required]"
        />

        <BillTagsSelect
          name="tags"
          return-object
          editable
          :disabled="disabled"
        />

        <EInputText
          name="reference"
          :disabled="disabled"
          label="Referência"
        />
      </div>

      <ETextarea
        :disabled="disabled"
        name="observations"
        label="Observação"
      />

      <div class="flex gap-4 w-350px">
        <ESwitch
          name="isPaid"
          label="Pago"
          :disabled="disabled"
        />
  
        <EDatePicker
          v-if="form.values.isPaid"
          name="paymentDate"
          :disabled="disabled"
          label="Data de pagamento"
        />
      </div>
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