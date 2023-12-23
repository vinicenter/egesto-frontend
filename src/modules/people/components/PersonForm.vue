<script lang="ts" setup>
import type { IPeople } from '../types/people';
import { emailValidation, required, cpfCnpjValidator } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues?: IPeople;
}>();

const emit = defineEmits<{
  (e: 'submit', values: IPeople): void
}>();

const form = useForm<IPeople>({
  initialValues: props.initialValues,
})

const disabled = computed(() => props.loading || props.disabled);

const submit = form.handleSubmit(async (values) => {
  emit('submit', values);
});
</script>

<template>
  <form @submit.prevent="submit">

    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
        <EInputText
          name="corporateName"
          :disabled="disabled"
          label="Razão Social"
          :rules="[required]"
        />

        <EInputText
          name="fantasyName"
          :disabled="disabled"
          label="Nome Fantasia"
          :rules="[required]"
        />

        <EInputText
          name="document"
          :disabled="disabled"
          label="CNPJ / CPF"
          :rules="[required, cpfCnpjValidator]"
        />

        <EInputText
          name="stateRegistration"
          :disabled="disabled"
          label="Inscrição Estadual"
        />

        <EInputText
          name="phone"
          :disabled="disabled"
          label="Celular"
        />

        <EInputText
          name="email"
          :disabled="disabled"
          label="E-mail"
          :rules="[emailValidation]"
        />

        <EInputText
          name="address.zipCode"
          :disabled="disabled"
          label="CEP"
        />

        <ESelectStates
          name="address.federativeUnit"
          :disabled="disabled"
          label="UF"
          :rules="[required]"
        />

        <EInputText
          name="address.city"
          :disabled="disabled"
          label="Cidade"
        />

        <EInputText
          name="address.neighborhood"
          :disabled="disabled"
          label="Bairro"
        />

        <EInputText
          name="address.street"
          :disabled="disabled"
          label="Rua"
        />

        <EInputText
          name="address.number"
          :disabled="disabled"
          label="Número"
        />
      </div>
    </section>

    <ETextarea
      name="observation"
      :disabled="disabled"
      label="Observação"
    />

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-sm">
      <VBtn
        :loading="loading"
        color="primary"
        type="submit"
        class="w-20"
        block
      >
        {{ buttonLabel }}
      </VBtn>

      <VBtn
        @click="router.push({ name: 'list-people' })"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </div>
  </form>
</template>