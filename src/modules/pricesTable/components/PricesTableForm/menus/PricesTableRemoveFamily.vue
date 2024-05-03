<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
	disabled?: boolean
}>()

const emit = defineEmits<{
	(e: 'removeFamily'): void
}>()

const dialog = ref(false)

const sendRemoveFamily = () => {
  dialog.value = false

  emit('removeFamily')
}
</script>

<template>
	<VDialog
		v-model="dialog"
		max-width="400"
		persistent
	>
		<template v-slot:activator="{ props }">
      <VTooltip open-on-click location="top">
        <template v-slot:activator="{ props: propsTooltip }">
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

		<VCard
			prepend-icon="mdi-trash-can-outline"
			text="Ao remover uma família, todos os dados de produtos inseridos nela serão perdidos."
			title="Deseja remover esta família?"
		>
			<template v-slot:actions>
				<v-spacer></v-spacer>

				<VBtn color="primary" @click="dialog = false">
					Cancelar
				</VBtn>

				<VBtn color="error" @click="sendRemoveFamily">
					Remover
				</VBtn>
			</template>
		</VCard>
	</VDialog>
</template>
