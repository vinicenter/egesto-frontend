<script lang="ts" setup>
import { useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { createBill, deleteBill, getBill, updateBill } from '../../datasource/bills';
import { IBill } from '../../types/bill';

const router = useRouter()

const props = defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const initialValuesCreate = {
  observations: '',
  isPaid: false,
}

const queryClient = useQueryClient()

const finish = () => {
  queryClient.invalidateQueries(['bills'])
  queryClient.invalidateQueries(['bills-summary'])
  queryClient.invalidateQueries(['bills-cumulative'])
  router.push({ name: 'list-bills' })
}

const formatSubmit = (data: IBill) => {
  const isSelectUndefined = (props.type === 'criar' || props.type === 'clonar')

  const recipient = isSelectUndefined
    ? data.recipient?._id ? data.recipient?._id : undefined
    : data.recipient?._id ? data.recipient?._id : null

  const installment = isSelectUndefined
    ? data.installment?._id ? data.installment?._id : undefined
    : data.installment?._id ? data.installment?._id : null

  const paymentBank = isSelectUndefined
    ? data.paymentBank?._id ? data.paymentBank?._id : undefined
    : data.paymentBank?._id ? data.paymentBank?._id : null

  return {
    ...data,
    paymentBank,
    amount: Number(data.amount),
    recipient: recipient,
    installment: installment,
    tags: data.tags?.length
      ? data.tags.map((tag) => tag._id)
      : [],
  }
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getBill"
    :delete-fn="deleteBill"
    :create-fn="createBill"
    :update-fn="updateBill"
    :initial-values-create="initialValuesCreate"
    :formatSubmitFn="formatSubmit"
    @finish="finish"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <BillForm
        :initialValues="data"
        :button-label="buttonLabel"
        :loading="loadingSubmit"
        :disabled="type === 'deletar'"
        @submit="submit"
      />
    </template>
  </EGenericIdForm>
</template>

<route lang="yaml">
name: bill
path: /contas/:id/:type
meta:
  title: Conta
</route>
