<script setup lang="ts">
import { computed } from 'vue';
import { updateBill } from '../datasource/bills';
import { IBill } from '../types/bill';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps<{
  item: IBill
}>()

const { displayMessage } = useNotify();
const queryClient = useQueryClient();

const buttonIcon = computed(() => {
  return props.item.isPaid ? 'mdi-cash-remove' : 'mdi-cash-check'
})

const buttonTitle = computed(() => {
  return props.item.isPaid ? 'Marcar como não pago' : 'Marcar como pago'
})

const loading = ref(false)

const execute = async () => {
  loading.value = true

  try {
    await updateBill(props.item._id!, {
      isPaid: !props.item.isPaid
    })

    queryClient.invalidateQueries(['bills'])
    queryClient.invalidateQueries(['bills-summary'])
  } catch {
    displayMessage({
      message: 'Erro ao atualizar conta',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VMenu :close-on-content-click="false" location="center center">
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        color="purple"
        :icon="buttonIcon"
        :title="buttonTitle"
        size="small"
      />
    </template>

    <VCard>
      <VCardTitle>
        Marcar como {{ item.isPaid ? 'não pago' : 'pago' }}?
      </VCardTitle>

      <VCardActions>
        <VBtn
          color="purple"
          :loading="loading"
          @click="execute"
        >
          Sim
        </VBtn>
      </VCardActions>
    </VCard>
  </VMenu>
</template>
