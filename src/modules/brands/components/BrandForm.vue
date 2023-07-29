<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IBrand } from '../types/brand';
import { required } from '@/src/core/utils/form-validator';

const router = useRouter();

const props = defineProps<{
  model: IBrand;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <div>
      <VTextField
        v-model="model.name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <VTextarea
        :disabled="disabled"
        v-model="model.description"
        label="Observação"
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
        @click="router.push({ name: 'list-brands' })"
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