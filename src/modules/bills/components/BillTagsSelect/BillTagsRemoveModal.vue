<script setup lang="ts">
import { ref } from 'vue';
import { IBillTagRoot } from '../../types/bill-tags';
import { deleteBillTag } from '../../datasource/bill-types';
import useNotify from '@/src/core/composables/useNotify';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps<{
  billTagData?: IBillTagRoot
}>()

const emit = defineEmits<{
  (e: 'removeTag', data: IBillTagRoot): void
}>()

const loading = ref(false)
const { displayMessage } = useNotify()
const queryClient = useQueryClient()

const submit = async () => {
  try {
    loading.value = true

    if(!props.billTagData || !props.billTagData._id) {
      throw new Error('Props billTagData is required')
    }

    await deleteBillTag(props.billTagData._id)
    await queryClient.invalidateQueries(['bills-tag'])

    emit('removeTag', props.billTagData)

    displayMessage({
      message: 'Tag excluída com sucesso',
      type: 'success',
    })

    modelValue.value = false
  } catch {
    displayMessage({
      message: 'Erro ao excluir tag',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const modelValue = defineModel<boolean>()
</script>

<template>
  <VDialog
    v-model="modelValue"
    max-width="400"
    persistent
  >
    <template #default>
      <VCard
        prepend-icon="mdi-tag"
        text="Ao excluir uma tag, ela será mantida em contas que já a possuem por questões de histórico."
        title="Deseja excluir tag?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
  
          <VBtn @click="modelValue = false">
            Fechar
          </VBtn>
  
          <VBtn
            :loading="loading"
            color="red"
            @click="submit"
          >
            Excluir
          </VBtn>
        </template>
      </VCard>
    </template>
  </VDialog>
</template>
