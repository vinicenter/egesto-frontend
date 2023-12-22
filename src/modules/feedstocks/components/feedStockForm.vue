<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IFeedstock } from '../types/feedstocks';
import { required } from '@/src/core/utils/form-validator';
import { watch } from 'vue';
import minimumFractionDigits from '~constants/minimumFractionDigits'
import { ref } from 'vue';

const router = useRouter();

const props = defineProps<{
  model: IFeedstock;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const priceWithoutIcms = ref(props.model.priceWithoutIcms);

watch([() => props.model.icms, () => props.model.price], () => {
  const newPriceWithoutIcms = (props.model.price * (1 - (props.model.icms / 100)))

  priceWithoutIcms.value = Number(newPriceWithoutIcms.toFixed(minimumFractionDigits));
});

const emit = defineEmits(['submit']);

const disabled = computed(() => props.loading || props.disabled);
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
      <VTextField
        v-model="model.name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <ESelectBrands
        v-model="model.brand"
        :disabled="disabled"
        return-object
      />

      <VTextField
        v-model="model.ncm"
        :disabled="disabled"
        label="NCM"
      />

      <EInputPrice
        v-model="model.price"
        :disabled="disabled"
        :rules="[required]"
      />

      <EInputPct
        v-model="model.icms"
        :disabled="disabled"
        label="ICMS (%)"
        :rules="[required]"
      />

      <VTextField
        v-model="priceWithoutIcms"
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
  </EForm>
</template>