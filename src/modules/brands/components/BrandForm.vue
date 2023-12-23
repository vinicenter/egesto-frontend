<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IBrand } from '../types/brand';
import { required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';
import EInputText from '@/src/core/components/EInput/EInputText.vue';

const router = useRouter();

const props = defineProps<{
  initialValues: IBrand;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const emit = defineEmits(['submit']);

const form = useForm<IBrand>({
  initialValues: props.initialValues,
})

const disabled = computed(() => props.loading || props.disabled);

const submit = form.handleSubmit(async (values) => {
  emit('submit', values);
});
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <EInputText
        name="name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <ETextarea
        :disabled="disabled"
        name="description"
        label="Observação"
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
        @click="router.push({ name: 'list-brands' })"
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