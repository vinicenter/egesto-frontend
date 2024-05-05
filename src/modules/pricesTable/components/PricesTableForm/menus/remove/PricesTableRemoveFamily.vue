<script setup lang="ts">
defineProps<{
	disabled?: boolean
}>()

const emit = defineEmits<{
	(e: 'removeFamily'): void
}>()
</script>

<template>
	<EDialogConfirm
		icon="mdi-trash-can-outline"
		text="Ao remover uma família, todos os dados de produtos inseridos nela serão perdidos."
		title="Deseja remover esta família?"
		@confirm="emit('removeFamily')"
	>
		<template #activator="{ props }">
      <VTooltip open-on-click location="top">
        <template #activator="{ props: propsTooltip }">
          <VBtn
            v-bind="{ ...propsTooltip, ...props }"
            prepend-icon="mdi-trash-can-outline"
						:disabled="disabled"
            color="error"
          >
            Remover Família
          </VBtn>
        </template>

        <span>Remover família da tabela de preço</span>
      </VTooltip>
		</template>

    <template #actions="{ confirm, close }">
      <VBtn
        @click="close"
      >
        Cancelar
      </VBtn>

      <VBtn
        color="error"
        @click="confirm"
      >
        Remover
      </VBtn>
    </template>
	</EDialogConfirm>
</template>
