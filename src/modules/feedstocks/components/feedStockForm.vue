<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IFeedstock } from '../types/feedstocks';
import { required } from '@/src/core/utils/form-validator';
import { watch } from 'vue';
import minimumFractionDigits from '~constants/minimumFractionDigits'
import { useForm } from 'vee-validate';
import EInputText from '@/src/core/components/EInput/EInputText.vue';

const router = useRouter();

const props = defineProps<{
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues?: IFeedstock;
}>();

const form = useForm<IFeedstock>({
  initialValues: props.initialValues,
});

watch([() => form.values.icms, () => form.values.price], () => {
  const newPriceWithoutIcms = (form.values.price * (1 - (form.values.icms / 100)))

  form.setFieldValue('priceWithoutIcms', Number(newPriceWithoutIcms.toFixed(minimumFractionDigits)));
});

const emit = defineEmits<{
  (e: 'submit', values: IFeedstock): void
}>()

const submit = form.handleSubmit((values) => {
  emit('submit', values);
});

const disabled = computed(() => props.loading || props.disabled);
</script>

<template>
  <form @submit.prevent="submit">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
      <EInputText
        name="name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <ESelectBrands
        name="brand"
        :disabled="disabled"
        return-object
      />

      <EInputText
        name="ncm"
        :disabled="disabled"
        label="NCM"
      />

      <EInputPrice
        name="price"
        :disabled="disabled"
        :rules="[required]"
      />

      <EInputPct
        name="icms"
        :disabled="disabled"
        label="ICMS (%)"
        :rules="[required]"
      />

      <EInputText
        name="priceWithoutIcms"
        :disabled="disabled"
        prefix="R$"
        label="Preço sem ICMS"
        readonly
        :rules="[required]"
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
        @click="router.push({ name: 'list-feedstocks' })"
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