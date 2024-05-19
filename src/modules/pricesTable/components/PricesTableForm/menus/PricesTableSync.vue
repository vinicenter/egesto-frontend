<script setup lang="ts">
defineProps<{
	disabled?: boolean
  tooltipText?: string
}>()
</script>

<template>
	<EDialogConfirm
		icon="mdi-sync"
		text="Essa operação é ireversível."
		title="Deseja sincronizar?"
	>
		<template #activator="{ props }">
      <VTooltip open-on-click location="top">
        <template v-slot:activator="{ props: propsTooltip }">
          <VBtn
            v-bind="{ ...propsTooltip, ...props }"
            icon="mdi-sync"
            color="warning"
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
        color="warning"
        @click="confirm"
      >
        Sincronizar
      </VBtn>
    </template>
	</EDialogConfirm>
</template>
