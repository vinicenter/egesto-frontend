<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteBank } from '../../datasource/bank';

const props = defineProps<{
  bankId?: string
}>()

const emit = defineEmits<{
  (e: 'removeBank', bankId: string): void
}>()

const { displayMessage } = useNotify()
const queryClient = useQueryClient()
const modelValue = defineModel<boolean>()

const mutation = useMutation({
  mutationFn: () => deleteBank(props.bankId!),
  onSuccess: () => {
    queryClient.invalidateQueries([ 'banks' ])

    displayMessage({
      message: 'Banco excluído com sucesso',
      type: 'success',
    })

    emit('removeBank', props.bankId!)
    modelValue.value = false
  },
  onError: () => {
    displayMessage({
      message: 'Erro ao excluir banco',
      type: 'error',
    })
  },
})
</script>

<template>
  <VDialog
    v-model="modelValue"
    max-width="400"
    persistent
  >
    <template #default>
      <VCard
        prepend-icon="mdi-bank"
        text="Ao excluir um banco, este será mantido em registros anteriores, mas não poderá ser selecionado novamente."
        title="Deseja excluir este banco?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
  
          <VBtn @click="modelValue = false">
            Fechar
          </VBtn>
  
          <VBtn
            :loading="mutation.isLoading.value"
            color="red"
            @click="mutation.mutate"
          >
            Excluir
          </VBtn>
        </template>
      </VCard>
    </template>
  </VDialog>
</template>
