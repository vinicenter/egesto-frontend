<script setup lang="ts">
import { cnpj } from 'cpf-cnpj-validator';
import useNotify from '@/src/core/composables/useNotify';
import { useFormErrors, useFormValues, useSetFormValues } from 'vee-validate';
import { computed } from 'vue';
import { IPeople } from '../types/people';
import { consultCnpjData } from '../datasource/people'
import { useMutation } from '@tanstack/vue-query';
import { removeCnpjFormat } from '@/src/core/utils/format';
import { cpfCnpjValidator, required } from '@/src/core/utils/form-validator';
import { refAutoReset } from '@vueuse/core'

defineProps<{
  disabled: boolean;
}>();

const notify = useNotify();

const formValues = useFormValues<IPeople>();
const formSetValues = useSetFormValues<IPeople>();
const formErrors = useFormErrors<IPeople>();

const hasRecentConsult = refAutoReset(false, 3000)

const isConsultEnabled = computed(() => {
  if(!formValues.value.document || hasRecentConsult.value) return;

  return cnpj.isValid(formValues.value.document) && formErrors.value.document === undefined;
});

const {
  mutateAsync: consultDocument,
  isLoading: loadingConsultDocument,
} = useMutation({
  mutationFn: () => {
    const cnpjWithoutFormat = removeCnpjFormat(formValues.value.document!);

    return consultCnpjData(cnpjWithoutFormat)
  },
})

const consultCnpj = async () => {
  try {
    hasRecentConsult.value = true

    const data = await consultDocument()

    formSetValues({
      corporateName: data.nome,
      fantasyName: data.fantasia || data.nome,
      document: data.cnpj,
      email: data.email || undefined,
      phone: data.telefone || undefined,
      address: {
        zipCode: data.cep || undefined,
        city: data.municipio|| undefined,
        complement: data.complemento|| undefined,
        neighborhood: data.bairro|| undefined,
        number: data.numero|| undefined,
        street: data.logradouro|| undefined,
        federativeUnit: data.uf|| undefined,
      },
    })

    notify.displayMessage({
      message: 'CNPJ consultado com sucesso',
      type: 'success',
    })
  } catch {
    notify.displayMessage({
      message: 'Não foi possível consultar o CNPJ informado. Tente novamente mais tarde.',
      type: 'error',
    })
  }
}
</script>

<template>
  <EInputText
    name="document"
    label="CNPJ / CPF"
    :append-inner-icon="isConsultEnabled ? 'mdi-magnify' : undefined"
    @click:append-inner="consultCnpj"
    :disabled="disabled || loadingConsultDocument"
    :loading="loadingConsultDocument"
    :rules="[required, cpfCnpjValidator]"
  />
</template>
