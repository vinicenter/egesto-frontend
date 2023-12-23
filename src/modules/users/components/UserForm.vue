<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IUser } from '../types/auth';
import { emailValidation, required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';

const router = useRouter();

const props = defineProps<{
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
  passwordRequired: boolean,
  initialValues: IUser
}>();

const emit = defineEmits<{
  (e: 'submit', values: IUser): void
}>();

const disabled = computed(() => props.loading || props.disabled);

const { handleSubmit } = useForm<IUser>({
  initialValues: props.initialValues
})

const submit = handleSubmit(async (values) => emit('submit', values))
</script>

<template>
  <form @submit.prevent="submit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
      <EInputText
        name="name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <EInputText
        name="username"
        :disabled="disabled"
        label="Usuário"
        :rules="[required]"
      />

      <EInputText
        name="email"
        :disabled="disabled"
        label="Email"
        :rules="[required, emailValidation]"
      />

      <EInputText
        name="password"
        :disabled="disabled"
        label="Senha"
        type="password"
        :rules="passwordRequired ? [required] : []"
      />
    </div>

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
        @click="router.push({ name: 'list-users' })"
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