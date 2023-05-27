<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
  model: {
    tenant: string;
    username: string;
    password: string;
  };
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const isFormCompleted = ref(false);

const required = (v: string) => !!v || 'Campo obrigatório';
</script>

<template>
  <VForm
    fast-fail
    v-model="isFormCompleted"
    @submit.prevent="emit('submit', $event)"
  >
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
      :disabled="!isFormCompleted"
      type="submit"
      class="mt-2"
      block
    >
      Entrar
    </VBtn>
  </VForm>
</template>