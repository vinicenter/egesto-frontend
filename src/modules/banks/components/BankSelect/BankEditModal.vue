<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';
import { createBank, updateBank } from '../../datasource/bank';
import { Bank } from '../../types/bank';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import BankAccountTypeSelect from '../BankAccountTypeSelect.vue';
import BankingInstitutionsSelect from '../BankingInstitutionsSelect.vue';

const props = defineProps<{
  bank?: Bank
}>()

const emit = defineEmits<{
  (e: 'new', newBank: Bank): void
  (e: 'update', updatedBank: Bank): void
}>()

const modelValue = defineModel<boolean>();

const { displayMessage } = useNotify()
const queryClient = useQueryClient()

const getInitialValues = () => {
  return props.bank ? props.bank : {}
}

const {
  handleSubmit,
  setValues,
} = useForm<Bank>({
  initialValues: getInitialValues()
})

watch(modelValue, (isOpen) => {
  if(isOpen) {
    setValues(getInitialValues())
  }
})

const mutationUpdateBank = useMutation({
  mutationFn: (updatedBank: Bank) => updateBank(props.bank!._id!, updatedBank),
  onSuccess: (data) => {
    queryClient.invalidateQueries([ 'banks' ])

    displayMessage({
      message: 'Banco atualizado com sucesso',
      type: 'success',
    })

    emit('update', data)

    modelValue.value = false
  },
  onError: () => {
    displayMessage({
      message: 'Erro ao atualizar banco',
      type: 'error',
    })
  },
})

const mutationCreateBank = useMutation({
  mutationFn: (bankData: Bank) => createBank(bankData),
  onSuccess: (data) => {
    queryClient.invalidateQueries([ 'banks' ])

    displayMessage({
      message: 'Banco criado com sucesso',
      type: 'success',
    })

    emit('new', data)

    modelValue.value = false
  },
  onError: () => {
    displayMessage({
      message: 'Erro ao criar banco',
      type: 'error',
    })
  },
})

const isEditing = computed(() => !!props.bank)

const submit = handleSubmit(async (values) => {
  if(isEditing.value) {
    mutationUpdateBank.mutate(values)
  } else {
    mutationCreateBank.mutate(values)
  }
})

const loading = computed(() => {
  return mutationUpdateBank.isLoading.value || mutationCreateBank.isLoading.value
})
</script>

<template>
  <EDialog
    v-model="modelValue"
    title="Conta bancária"
    width="900"
  >
    <template #default>
      <form id="bank-form" @submit.prevent="submit">
        <div class="p-sm flex flex-col gap-2">
          <EInputText
            name="name"
            label="Nome (identificador)"
            :rules="required"
          />

          <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <BankingInstitutionsSelect name="bankNumber" />

            <EInputText
              name="agencyNumber"
              label="Agência"
            />
          </div>

          <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
            <BankAccountTypeSelect name="accountType" />

            <EInputText
              name="accountNumber"
              label="Número da conta"
              type="number"
            />

            <EInputText
              name="accountDigit"
              label="Dígito da conta"
              type="number"
            />
          </div>
        </div>
      </form>
    </template>

    <template #actions="{ isActive }">
      <VBtn
        variant="text"
        @click="isActive.value = false"
      >
        Fechar
      </VBtn>

      <VBtn
        variant="flat"
        color="primary"
        type="submit"
        form="bank-form"
        :loading="loading"
      >
        Salvar
      </VBtn>
    </template>
  </EDialog>
</template>
