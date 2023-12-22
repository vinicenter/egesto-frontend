<script lang="ts" setup>
import type { IPeople } from '../types/people';
import { required } from '@/src/core/utils/form-validator';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  model: IPeople;
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);
</script>

<template>
  <EForm @submit="emit('submit', $event)">

    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
        <VTextField
          :disabled="disabled"
          v-model="model.corporateName"
          label="Razão Social"
          :rules="[required]"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.fantasyName"
          label="Nome Fantasia"
          :rules="[required]"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.document"
          label="CNPJ / CPF"
          :rules="[required]"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.stateRegistration"
          label="Inscrição Estadual"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.phone"
          label="Celular"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.email"
          label="E-mail"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.address.zipCode"
          label="CEP"
        />

        <ESelectStates
          :disabled="disabled"
          v-model="model.address.federativeUnit"
          label="UF"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.address.city"
          label="Cidade"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.address.neighborhood"
          label="Bairro"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.address.street"
          label="Rua"
        />

        <VTextField
          :disabled="disabled"
          v-model="model.address.number"
          label="Número"
        />
      </div>
    </section>

    <VTextarea
      :disabled="disabled"
      v-model="model.observation"
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
  </EForm>
</template>