<script lang="ts" setup>
import { useField } from 'vee-validate';
import { reactive, useAttrs } from 'vue';
import { VListItemMedia } from 'vuetify/lib/components/index.mjs';
import { getBanks } from '../../datasource/bank';
import { Bank } from '../../types/bank';
import BankEditModal from './BankEditModal.vue';
import BankRemoveModal from './BankRemoveModal.vue';

const props = defineProps<{
  name: string,
  editable?: boolean,
  hideDetails?: boolean,
}>()

interface ModalState {
  modelValue: boolean,
  bank?: Bank,
}

const editModalState = reactive<ModalState>({
  modelValue: false,
  bank: undefined,
})

const openEditModal = (bank?: Bank) => {
  Object.assign(editModalState, {
    modelValue: true,
    bank,
  })
}

const removeModalState = reactive<ModalState>({
  modelValue: false,
  bank: undefined,
})

const openRemoveModal = (bank: Bank) => {
  Object.assign(removeModalState, {
    modelValue: true,
    bank,
  })
}
const {
  setValue,
  value: inputValue,
} = useField<Bank | undefined>(props.name)

const removeSelectedBank = (bankId: string) => {
  const selectedBankId = inputValue.value?._id

  if(selectedBankId === bankId) {
    setValue(undefined)
  }
}

const updateSelectedBank = (bank: Bank) => {
  const selectedBankId = inputValue.value?._id

  if(selectedBankId === bank._id) {
    setValue(bank)
  }
}

const attrs = useAttrs()
</script>

<template>
  <div>
    <ESelectQuery
      v-bind="attrs"
      :name="name"
      label="Conta bancária"
      :show-create="editable"
      query-key="banks"
      return-object
      :query-fn="getBanks"
      :hide-details="hideDetails"
      @create="openEditModal"
    >
      <template #item="scope">
        <VListItem v-bind="scope.props" title="">
          <VListItemMedia class="flex justify-between">
            <div class="flex items-center">
              {{ scope.item.raw.name }}
            </div>

            <div v-if="editable">
              <VBtn
                @click.prevent.stop="openEditModal(scope.item.raw)"
                icon="mdi-pencil"
                color="primary"
                size="x-small"
                title="Editar"
                variant="flat"
                class="ml-2"
              />
    
              <VBtn
                @click.prevent.stop="openRemoveModal(scope.item.raw)"
                icon="mdi-delete"
                color="red"
                size="x-small"
                title="Remover"
                variant="flat"
                class="ml-2"
              />
            </div>
          </VListItemMedia>
        </VListItem>
      </template>
    </ESelectQuery>

    <BankEditModal
      v-model="editModalState.modelValue"
      :bank="editModalState.bank"
      @new="setValue($event)"
      @update="updateSelectedBank"
    />

    <BankRemoveModal
      v-model="removeModalState.modelValue"
      :bank-id="removeModalState.bank?._id as string"
      @remove-bank="removeSelectedBank"
    />
  </div>
</template>
