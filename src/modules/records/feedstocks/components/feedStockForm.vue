<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IFeedstock } from '../types/feedstocks';
import { required } from '@/src/core/utils/form-validator';

const router = useRouter();

const props = defineProps<{
  model: IFeedstock;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
      <VTextField
        v-model="model.name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <VTextField
        v-model="model.price"
        :disabled="disabled"
        label="Preço"
        :rules="[required]"
      />

      <VTextField
        v-model="model.icms"
        :disabled="disabled"
        label="ICMS (%)"
        :rules="[required]"
      />

      <VTextField
        v-model="model.priceWithoutIcms"
        :disabled="disabled"
        label="ICMS (%)"
        :rules="[required]"
      />

      <VTextField
        v-model="model.ncm"
        :disabled="disabled"
        label="NCM"
        :rules="[required]"
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
        @click="router.push({ name: 'list-feedstocks' })"
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