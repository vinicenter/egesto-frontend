<script lang="ts" setup>
import type { PersonType } from '@/functions/api/v1/records/models/people.schemas.ts'
import { required } from '@/src/core/utils/form-validator';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps<{
  model: PersonType;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);
</script>

<template>
  <EForm @submit="emit('submit', $event)">

    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-sm">
        <VTextField
          v-model="model.document"
          label="CNPJ / CPF"
          :rules="[required]"
        />

        <VTextField
          v-model="model.stateRegistration"
          label="Inscrição Estadual"
        />

        <VTextField
          v-model="model.corporateName"
          label="Razão Social"
          :rules="[required]"
        />

        <VTextField
          v-model="model.fantasyName"
          label="Nome Fantasia"
          :rules="[required]"
        />

        <VTextField
          type="number"
          v-model="model.phone"
          label="Celular"
        />

        <VTextField
          v-model="model.email"
          label="E-mail"
        />

        <VTextField
          v-model="model.address.zipCode"
          label="CEP"
        />

        <VTextField
          v-model="model.address.street"
          label="Rua"
        />

        <VTextField
          v-model="model.address.number"
          label="Número"
        />

        <VTextField
          v-model="model.address.neighborhood"
          label="Bairro"
        />

        <VTextField
          v-model="model.address.city"
          label="Cidade"
        />

        <VTextField
          v-model="model.address.federativeUnit"
          label="UF"
          maxlenght="2"
        />
      </div>
    </section>

    <VTextarea
      v-model="model.observation"
      label="Observação"
    />

    <div class="grid grid-cols-4 gap-x-sm">
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