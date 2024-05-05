<script setup lang="ts">
defineProps<{
	disabled?: boolean
}>()

const emit = defineEmits<{
	(e: 'removeProduct'): void
}>()
</script>

<template>
	<EDialogConfirm
		icon="mdi-trash-can-outline"
		text="Ao remover o produto, todos os dados inseridos nele serão perdidos."
		title="Deseja remover este produto?"
		@confirm="emit('removeProduct')"
	>
		<template #activator="{ props }">
      <VTooltip open-on-click>
        <template v-slot:activator="{ props: propsTooltip }">
          <VBtn
            v-bind="{ ...propsTooltip, ...props }"
            icon="mdi-trash-can-outline"
            color="error"
            size="small"
            :disabled="disabled"
          />
        </template>

        <span>Remover produto</span>
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
