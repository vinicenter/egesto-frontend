<script lang="ts" setup>
import type { PersonType } from '@/functions/api/v1/records/models/people.schemas.ts'
import { required } from '@/src/core/utils/form-validator';

defineProps<{
  model: PersonType;
  loading: boolean;
}>();

const emit = defineEmits(['submit']);
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <VTextField
      v-model="model.document"
      label="CNPJ / CPF"
      :rules="[required]"
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
      v-model="model.stateRegistration"
      label="Inscrição Estadual"
    />

    <VBtn
      :loading="loading"
      type="submit"
      class="mt-2"
      block
    >
      Entrar
    </VBtn>
  </EForm>
</template>