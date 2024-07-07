<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';
import { useFormValues, useSetFieldValue } from 'vee-validate';
import { IBillInstallmentForm } from '../../types/bill-installment';
import EDialogConfirm from '@/src/core/components/EDialog/EDialogConfirm.vue';
import { IBill } from '../../types/bill';
import useNotify from '@/src/core/composables/useNotify';

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
      class="grid grid-cols-1 sm:grid-cols-4 gap-x-sm"
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

        <div class="flex justify-start items-center gap-lg">
          <ESwitch
            :name="`bills.${index}.isPaid`"
            label="Pago"
            :disabled="disabled"
          />

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
    text="Calcule suas parcelas clicando no botão abaixo"
    v-else
  >
    <template #actions>
      <InstallmentFormPortionsManageModal
        :disabled="disabled"
        @bills-calculated="addCalculatedBills"
        btn-icon="mdi-plus"
        btn-label="Calcular Parcelas"
      />
    </template>
  </VEmptyState>
</template>
