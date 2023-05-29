<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';

defineProps<{
  model: {
    tenant: string;
    username: string;
    password: string;
  };
  loading: boolean;
}>();

const emit = defineEmits(['submit']);
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <VTextField
      v-model="model.tenant"
      label="Empresa"
      :rules="[required]"
    />

    <VTextField
      v-model="model.username"
      label="Usuário"
      :rules="[required]"
    />

    <VTextField
      v-model="model.password"
      label="Senha"
      type="password"
      :rules="[required]"
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