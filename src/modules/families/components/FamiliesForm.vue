<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IFamily } from '../types/family';
import { required } from '@/src/core/utils/form-validator';
import { toRef } from 'vue';
import { ref } from 'vue';

const router = useRouter();

const props = defineProps<{
  model: IFamily;
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const costs = toRef(props.model, 'costs');
const emit = defineEmits(['submit']);
const disabled = computed(() => props.loading || props.disabled);

const loadingLoadCosts = ref(false);

const loadCostsFromFamily = async (family: IFamily) => {
  if(family?.costs) {
    costs.value = family.costs
  }
}
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <div class="grid grid-cols-1 gap-x-sm">
      <VTextField
        v-model="model.name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <ESelectFamilies
        :loading="loadingLoadCosts"
        label="Selecione uma família para copiar custos"
        @update:model-value="loadCostsFromFamily($event);"
        return-object
      />

      <VDivider class="m-y-sm" />

      <div class="font-bold">Custos</div>

      <EEditableListItem
        v-model="costs"
        class="grid grid-cols-1 md:grid-cols-2 gap-x-sm"
        :disabled="disabled"
      >
        <template #default="{ item, removeItem }">
          <VTextField
            v-model="item.name"
            :disabled="disabled"
            label="Nome"
            :rules="[required]"
          />

          <div class="flex gap-x-sm">
            <EInputPct
              v-model="item.value"
              :rules="[required]"
              :disabled="disabled"
              label="Custo (%)"
            />

            <VBtn 
              :disabled="disabled"
              color="red"
              @click="removeItem"
              icon="mdi-trash-can"
            />
          </div>
        </template>
      </EEditableListItem>
    </div>

    <VDivider class="m-y-sm" />

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
        @click="router.push({ name: 'list-families' })"
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