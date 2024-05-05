<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
	disabled?: boolean
  text: string
  title: string
  icon: string
	dontCloseOnConfirm?: boolean
}>()

const emit = defineEmits<{
	(e: 'confirm', close: () => void): void
}>()

const dialog = ref(false)

const close = () => {
	dialog.value = false
}

const confirm = () => {
  !props.dontCloseOnConfirm && close()

  emit('confirm', close)
}
</script>

<template>
	<VDialog
		v-model="dialog"
		max-width="400"
		persistent
	>
    <template
      v-for="(_, name) in ($slots as {})"
      #[name]="slotProps = {}"
    >
      <slot
        v-bind="slotProps"
        :name="name"
      />
    </template>

		<VCard
			:prepend-icon="icon"
			:text="text"
			:title="title"
		>
			<template v-slot:actions>
				<v-spacer></v-spacer>

				<slot
					name="actions"
					:confirm="confirm"
					:close="close"
				>
					<VBtn @click="close">
						Cancelar
					</VBtn>
	
					<VBtn color="primary" @click="confirm">
						Confirmar
					</VBtn>
				</slot>
			</template>
		</VCard>
	</VDialog>
</template>
