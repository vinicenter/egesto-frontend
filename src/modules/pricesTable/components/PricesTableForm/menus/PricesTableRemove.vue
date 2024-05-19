<script setup lang="ts">
defineProps<{
	disabled?: boolean
  tooltipText?: string
}>()
</script>

<template>
	<EDialogConfirm
		icon="mdi-trash-can-outline"
		text="Essa operação é ireversível."
		title="Deseja remover?"
	>
		<template #activator="{ props }">
      <VTooltip open-on-click location="top">
        <template v-slot:activator="{ props: propsTooltip }">
          <VBtn
            v-bind="{ ...propsTooltip, ...props }"
            icon="mdi-trash-can-outline"
            color="error"
            size="small"
            :disabled="disabled"
          />
        </template>

        <span>{{ tooltipText }}</span>
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
