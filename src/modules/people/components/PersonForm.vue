<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import type { IPeople } from '../types/people';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues?: IPeople;
}>();

const emit = defineEmits<{
  (e: 'submit', values: IPeople): void
}>();

const form = useForm<IPeople>({
  initialValues: props.initialValues,
})

const disabled = computed(() => props.loading || props.disabled);

const submit = form.handleSubmit(async (values) => {
  emit('submit', values);
});

const tab = ref<'info' | 'expenses'>('info')
</script>

<template>
  <form @submit.prevent="submit">
    <section>
      <div class="font-bold">Identificação</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
        <PersonDocumentField :disabled="disabled" />

        <EInputText
          name="corporateName"
          :disabled="disabled"
          label="Razão Social"
          :rules="[required]"
        />

        <EInputText
          name="fantasyName"
          :disabled="disabled"
          label="Nome Fantasia"
          :rules="[required]"
        />
      </div>
    </section>

    <VDivider class="m-y-sm" />

    <section>
      <VTabs grow class="m-y-4" v-model="tab">
        <VTab value="info">
          Informações Basicas
        </VTab>
        <VTab value="expenses">
          Despesas
        </VTab>
      </VTabs>

      <VWindow v-model="tab">
        <VWindowItem value="info" eager>
          <PersonInfoFields :disabled="disabled" />
        </VWindowItem>

        <VWindowItem value="expenses" eager>
          <PersonExpensesFields :disabled="disabled" />
        </VWindowItem>
      </VWindow>
    </section>

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
        @click="router.push({ name: 'list-people' })"
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