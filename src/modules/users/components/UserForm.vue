<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { IUser } from '../types/auth';
import { ref, computed } from 'vue';

const router = useRouter();

const props = defineProps<{
  model: IUser;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const isFormCompleted = ref(false);
const disabled = computed(() => props.loading || props.disabled);

const required = (v: string) => !!v || 'Campo obrigatório';
const emailValidation = (value: string) => {
  if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

  return 'Deve ser um email válido'
}
</script>

<template>
  <VForm
    fast-fail
    v-model="isFormCompleted"
    @submit.prevent="emit('submit', $event)"
    class="p-sm"
  >
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
        :rules="[required]"
      />
    </div>

    <div class="grid grid-cols-4 gap-x-sm">
      <VBtn
        :loading="loading"
        :disabled="disabled"
        color="primary"
        type="submit"
        class="w-20"
        block
      >
        {{ buttonLabel }}
      </VBtn>

      <VBtn
        @click="router.back()"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </div>
  </VForm>
</template>