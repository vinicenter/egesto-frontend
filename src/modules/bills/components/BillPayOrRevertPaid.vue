<script setup lang="ts">
import { updateBill } from '../datasource/bills';
import { IBill } from '../types/bill';
import { ref, watch } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { useQueryClient } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';

const props = defineProps<{
  item: IBill
}>()

const modelValue = defineModel<boolean>();

const { displayMessage } = useNotify();
const queryClient = useQueryClient();

interface FormValues {
  paymentDate?: string
  isPaid: boolean
}

const form = useForm<FormValues>({
  initialValues: {
    isPaid: props.item.isPaid,
    paymentDate: props.item.paymentDate
  }
})

watch([() => props.item, modelValue], () => {
  form.setValues({
    isPaid: props.item.isPaid,
    paymentDate: props.item.paymentDate
  })
})

const loading = ref(false)

const submit = form.handleSubmit(async (values) => {
  loading.value = true

  try {
    await updateBill(props.item._id!, values)

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

        <VCardText class="w-250px">
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
        </VCardText>

        <VCardActions>
          <div class="flex justify-center w-full">
            <VBtn
              color="purple"
              :loading="loading"
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
