<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';
import { useFormValues, useSetFieldValue } from 'vee-validate';
import { IBillInstallmentForm } from '../../types/bill-installment';
import EDialogConfirm from '@/src/core/components/EDialog/EDialogConfirm.vue';
import { IBill } from '../../types/bill';
import useNotify from '@/src/core/composables/useNotify';
import BankSelect from '@/src/modules/banks/components/BankSelect/BankSelect.vue';

const notify = useNotify();

const formValues = useFormValues<IBillInstallmentForm>();

const setBills = useSetFieldValue<Partial<IBill>[]>('bills')

const addCalculatedBills = (bills: Partial<IBill>[]) => {
  setBills(bills)

  notify.displayMessage({
    message: 'Parcelas calculadas com sucesso',
    type: 'success'
  })
}

defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <template v-if="formValues.bills?.length">
    <div class="flex gap-sm m-b-sm">
      <InstallmentFormPortionsManageModal
        :disabled="disabled"
        @bills-calculated="addCalculatedBills"
        btn-icon="mdi-refresh"
        btn-label="Recalcular Parcelas"
        warningMessage="Ao calcular, as parcelas atuais serão apagadas e será criado novas parcelas apartir desse recalculo."
      />

      <EDialogConfirm
        icon="mdi-trash-can-outline"
        text="Você irá precisar calcular as parcelas novamente."
        title="Deseja limpar as parcelas?"
        @confirm="setBills([])"
      >
        <template #activator="{ props }">
          <VBtn
            v-bind="{ ...props }"
            prepend-icon="mdi-trash-can-outline"
            color="red"
            :disabled="disabled"
          >
            Limpar parcelas
          </VBtn>
        </template>

        <template #actions="{ close, confirm }">
          <VBtn
            @click="close"
          >
            Cancelar
          </VBtn>

          <VBtn
            color="red"
            @click="confirm"
          >
            Limpar parcelas
          </VBtn>
        </template>
      </EDialogConfirm>
    </div>

    <EEditableListItem
      name="bills"
      class="grid grid-cols-1 lg:grid-cols-3 gap-x-sm"
      :disabled="disabled"
    >
      <template #default="{ index, removeItem }">
        <EDatePicker
          :name="`bills.${index}.dueDate`"
          :disabled="disabled"
          label="Data de vencimento"
          :rules="[required]"
        />

        <EInputPrice
          :name="`bills.${index}.amount`"
          :disabled="disabled"
          label="Valor da conta"
          :rules="[required]"
        />

        <EInputText
          :name="`bills.${index}.reference`"
          :disabled="disabled"
          label="Referência"
        />

        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-lg col-span-1 lg:col-span-3 mb-sm lg:mb-0">
          <div class="grid grid-cols-1 gap-4 w-full lg:grid-cols-3">

            <ESwitch
              :name="`bills.${index}.isPaid`"
              label="Pago"
              :disabled="disabled"
            />

            <EDatePicker
              v-if="formValues.bills[index].isPaid"
              :name="`bills.${index}.paymentDate`"
              :disabled="disabled"
              label="Data de pagamento"
            />

            <BankSelect
              v-if="formValues.bills[index].isPaid"
              :name="`bills.${index}.paymentBank`"
              :disabled="disabled"
              editable
            />
          </div>

          <EDialogConfirm
            v-if="formValues.bills.length > 1"
            icon="mdi-trash-can-outline"
            text="Essa operação é ireversível."
            title="Deseja remover?"
          >
            <template #activator="{ props }">
              <VBtn
                v-bind="{ ...props }"
                icon="mdi-trash-can-outline"
                color="red"
                size="small"
                :disabled="disabled"
              />
            </template>

            <template #actions="{ close }">
              <VBtn
                @click="close"
              >
                Cancelar
              </VBtn>

              <VBtn
                color="red"
                @click="removeItem"
              >
                Remover
              </VBtn>
            </template>
          </EDialogConfirm>
        </div>
      </template>
    </EEditableListItem>
  </template>

  <VEmptyState
    title="Nenhuma parcela adicionada"
    text="Escolha uma opção abaixo para adicionar parcelas."
    v-else
  >
    <template #actions>
      <InstallmentFormPortionsManageModal
        :disabled="disabled"
        @bills-calculated="addCalculatedBills"
        btn-icon="mdi-plus"
        btn-label="Calcular Parcelas"
      />

      <VBtn
        @click="setBills([{ dueDate: '', amount: undefined, reference: '', isPaid: false }])"
        color="primary"
        prepend-icon="mdi-plus"
        :disabled="disabled"
      >
        Adicionar Manualmente
      </VBtn>
    </template>
  </VEmptyState>
</template>
