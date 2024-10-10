<script setup lang="ts">
import { deleteProductSize } from '../../datasource/products-size';
import useNotify from '@/src/core/composables/useNotify';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { ProductSize } from '../../types/productSize';

const props = defineProps<{
  productSize?: ProductSize
}>()

const emit = defineEmits<{
  (e: 'removeProductSize', data: ProductSize): void
}>()

const { displayMessage } = useNotify()
const queryClient = useQueryClient()
const modelValue = defineModel<boolean>()

const deleteProductSizeMutation = useMutation({
  mutationFn: () => deleteProductSize(props.productSize!._id),
  onSuccess: () => {
    displayMessage({
      message: 'Tamanho excluído com sucesso',
      type: 'success'
    })

    emit('removeProductSize', props.productSize!)
    queryClient.invalidateQueries(['product-size'])

    modelValue.value = false
  },
  onError: () => displayMessage({
    message: 'Erro ao excluir tamanho',
    type: 'error'
  })
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
        text="Ao excluir um tamanho, ele será mantido em produtos que já a possuem por questões de histórico."
        title="Deseja excluir o tamanho?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
  
          <VBtn @click="modelValue = false">
            Fechar
          </VBtn>
  
          <VBtn
            :loading="deleteProductSizeMutation.isLoading.value"
            color="red"
            @click="deleteProductSizeMutation.mutate()"
          >
            Excluir
          </VBtn>
        </template>
      </VCard>
    </template>
  </VDialog>
</template>
