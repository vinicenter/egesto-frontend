<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IUser } from '../types/auth';
import { emailValidation, required } from '@/src/core/utils/form-validator';

const router = useRouter();

const props = defineProps<{
  model: IUser;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
  passwordRequired: boolean,
}>();

const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <div class="grid grid-cols-2 gap-x-sm">
      <VTextField
        v-model="model.name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <VTextField
        v-model="model.username"
        :disabled="disabled"
        label="Usuário"
        :rules="[required]"
      />

      <VTextField
        v-model="model.email"
        :disabled="disabled"
        label="Email"
        :rules="[emailValidation]"
      />

      <VTextField
        v-model="model.password"
        :disabled="disabled"
        label="Senha"
        type="password"
        :rules="passwordRequired ? [required] : []"
      />
    </div>

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
        @click="router.push({ name: 'list-users' })"
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