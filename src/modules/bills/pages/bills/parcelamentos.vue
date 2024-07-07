<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { createInstallment, deleteInstallment, getInstallment, updateInstallment } from '../../datasource/bill-installments';
import { IBillInstallment, IBillInstallmentForm } from '../../types/bill-installment';

const props = defineProps<{ id: string | 'novo', type: 'criar' | 'deletar' | 'editar' | 'clonar' }>()

const queryClient = useQueryClient()
const router = useRouter()

const initialValuesCreate: Partial<IBillInstallmentForm> = {
  bills: [],
  name: '',
  observations: '',
  tags: [],
  _id: '',
}

const formatSubmit = (data: IBillInstallmentForm): IBillInstallment => {
  const isSelectUndefined = (props.type === 'criar' || props.type === 'clonar')

  const recipient = isSelectUndefined
    ? data.recipient?._id ? data.recipient?._id : undefined
    : data.recipient?._id ? data.recipient?._id : null

  const tags = data.tags?.length
    ? data.tags.map((tag) => tag._id!)
    : []

  const bills = data.bills.map((bill) => ({
    ...bill,
    amount: Number(bill.amount),
    isPaid: !!bill.isPaid
  }))

  return {
    _id: data._id,
    name: data.name,
    observations: data.observations,
    paymentMethod: data.paymentMethod,
    recipient,
    tags,
    bills,
  }
}

const finish = () => {
  queryClient.invalidateQueries(['bills'])
  queryClient.invalidateQueries(['bills-summary'])
  queryClient.invalidateQueries(['bills-cumulative'])
  router.push({ name: 'list-bills' })
}
</script>

<template>
  <EGenericIdForm
    :id="id"
    :type="type"
    :get-fn="getInstallment"
    :delete-fn="deleteInstallment"
    :create-fn="createInstallment"
    :update-fn="updateInstallment"
    :initial-values-create="initialValuesCreate"
    :formatSubmitFn="formatSubmit"
    @finish="finish"
  >
    <template #default="{ data, buttonLabel, submit, loadingSubmit }">
      <InstallmentForm
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
name: bill-installment
path: /contas/parcelamentos/:id/:type
meta:
  title: Parcelamento
</route>
