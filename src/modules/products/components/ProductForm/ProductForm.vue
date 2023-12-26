<script lang="ts" setup>
import type { IProduct } from '../../types/product';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import useNotify from '@/src/core/composables/useNotify';

const router = useRouter();
const { displayMessage } = useNotify();

const props = defineProps<{
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues: IProduct.Root;
}>();

const emit = defineEmits<{
  (e: 'submit', value: IProduct.Root): void;
}>();

const disabled = computed(() => props.loading || props.disabled);

const form = useForm<IProduct.Root>({
  initialValues: props.initialValues,
});

const submit = form.handleSubmit((values) => {
  emit('submit', values);
}, (errorEvent) => {
  const error = Object.keys(errorEvent.errors)
  const errorMessage = `Verifique os campos do formulário: ${error.join(', ')}`

  displayMessage({
    type: 'error',
    message: errorMessage,
  });
});

const tab = ref('informations')
</script>

<template>
  <form @submit.prevent="submit">
    <VTabs grow class="m-y-4" v-model="tab">
      <VTab value="informations">
        Informações básicas
      </VTab>
      <VTab value="formulation">
        Formulação
      </VTab>
      <VTab value="marketing">
        Marketing
      </VTab>
    </VTabs>

    <VWindow v-model="tab">
      <VWindowItem value="informations" eager>
        <ProductFormInfo :disabled="disabled" />
      </VWindowItem>

      <VWindowItem value="formulation" eager>
        <ProductFormFormulation :disabled="disabled" />
      </VWindowItem>

      <VWindowItem value="marketing" eager>
        <ProductFormMarketing :disabled="disabled" />
      </VWindowItem>
    </VWindow>

    <VDivider class="m-y-sm" />

    <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-sm">
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
        @click="router.push({ name: 'list-products' })"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </section>
  </form>
</template>