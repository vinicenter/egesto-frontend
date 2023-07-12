<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IFamily } from '../types/family';
import { required } from '@/src/core/utils/form-validator';
import { getFamily } from '../datasource/families'
import { toRef } from 'vue';
import ESelectFamilies from '@/src/core/components/ESelect/ESelectFamilies.vue';
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

const addNewCost = () => {
  const value: IFamily['costs'][0] = { name: '', value: undefined };

  costs.value.push(value);
};

const removeCost = (index: number) => {
  costs.value.splice(index, 1);
};

const loadingLoadCosts = ref(false);

const loadCostsFromFamily = async (id: string) => {
  try {
    loadingLoadCosts.value = true;

    const family = await getFamily(id);

    costs.value = family.costs;
  }
  finally {
    loadingLoadCosts.value = false;
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
      />

      <VDivider class="m-y-sm" />

      <div class="font-bold">Custos</div>

      <div v-if="costs.length === 0" class="flex flex-col justify-center">
        <div>Nenhum custo cadastrado</div>
      </div>

      <template v-else>
        <div v-for="(cost, index) in costs" :key="`cost-${index}`" class="grid grid-cols-1 md:grid-cols-2 gap-x-sm">
          <VTextField
            v-model="cost.name"
            :disabled="disabled"
            label="Nome"
            :rules="[required]"
          />

          <div class="flex gap-x-sm">
            <VTextField
              v-model="cost.value"
              type="number"
              :disabled="disabled"
              label="Custo (%)"
              suffix="%"
              :rules="[required]"
            />

            <VBtn 
              :disabled="disabled"
              color="red"
              @click="removeCost(index)"
              icon="mdi-trash-can"
            />
          </div>
        </div>
      </template>

      <VBtn @click="addNewCost" color="green" icon="mdi-plus" />
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