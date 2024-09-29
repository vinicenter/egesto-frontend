<script setup lang="ts">
import { updateBill } from '../datasource/bills';
import { IBillRoot } from '../types/bill';
import { ref, watch } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { useQueryClient } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import BankSelect from '../../banks/components/BankSelect/BankSelect.vue';
import { Bank } from '../../banks/types/bank';

const props = defineProps<{
  item: IBillRoot
}>()

const modelValue = defineModel<boolean>();

const { displayMessage } = useNotify();
const queryClient = useQueryClient();

interface FormValues {
  paymentBank?: Bank
  paymentDate?: string
  isPaid: boolean
}

const form = useForm<FormValues>({
  initialValues: {
    isPaid: props.item.isPaid,
    paymentDate: props.item.paymentDate,
    paymentBank: props.item.paymentBank
  }
})

watch([() => props.item, modelValue], () => {
  form.setValues({
    isPaid: props.item.isPaid,
    paymentDate: props.item.paymentDate,
    paymentBank: props.item.paymentBank
  })
})

const loading = ref(false)

const submit = form.handleSubmit(async (values) => {
  loading.value = true

  try {
    await updateBill(props.item._id!, {
      ...values,
      paymentBank: values.paymentBank?._id,
    })

    queryClient.invalidateQueries(['bills'])
    queryClient.invalidateQueries(['bills-summary'])
    queryClient.invalidateQueries(['bills-cumulative'])

    displayMessage({
      message: 'Conta atualizada com sucesso',
      type: 'success'
    })
  } catch {
    displayMessage({
      message: 'Erro ao atualizar conta',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <VMenu :close-on-content-click="false" location="center center" v-model="modelValue">
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        color="purple"
        icon="mdi-cash-check"
        title="Modificar pagamento"
        size="small"
      />
    </template>

    <VCard>
      <form @submit.prevent="submit">
        <VCardTitle>
          Modificar pagamento
        </VCardTitle>

        <VCardText class="w-350px space-y-2">
          <ESwitch
            name="isPaid"
            label="Pago"
            hide-details
          />

          <EDatePicker
            v-if="form.values.isPaid"
            name="paymentDate"
            label="Data de pagamento"
            hide-details
          />

          <BankSelect
            v-if="form.values.isPaid"
            name="paymentBank"
            editable
            hide-details
          />
        </VCardText>

        <VCardActions>
          <div class="flex justify-center w-full">
            <VBtn
              color="purple"
              :loading="loading"
              variant="elevated"
              type="submit"
            >
              Atualizar
            </VBtn>
          </div>
        </VCardActions>
      </form>
    </VCard>
  </VMenu>
</template>
