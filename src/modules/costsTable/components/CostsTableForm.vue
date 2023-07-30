<script lang="ts" setup>
import type { ICostsTable } from '../types/costsTable';
import { required } from '@/src/core/utils/form-validator';
import { ref } from 'vue';
import { toRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  model: ICostsTable.Root;
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
}>();

const model = toRef(props, 'model');
const emit = defineEmits(['submit']);

const tab = ref('taxes');
</script>

<template>
  <EForm @submit="emit('submit', $event)">
    <section>
      <div>
        <VTextField
          :disabled="disabled"
          v-model="model.name"
          label="Identificador"
          :rules="[required]"
        />
      </div>
    </section>

    <VDivider />

    <section>
      <VTabs fixed-tabs v-model="tab">
        <VTab value="taxes">
          Impostos
        </VTab>
        <VTab value="shipping-families">
          Frete Familias
        </VTab>
        <VTab value="shipping-products">
          Frete Produtos
        </VTab>
      </VTabs>

      <VWindow v-model="tab">
        <VWindowItem value="taxes" class="m-t-sm" eager>
          <EEditableListItem
            v-model="model.taxes"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm"
            :disabled="disabled"
          >
            <template #default="{ removeItem, item }">
              <VTextField
                v-model="item.name"
                :disabled="disabled"
                label="Nome"
                :rules="[required]"
              />

              <div class="flex gap-x-sm">
                <EInputPct
                  v-model="item.cost"
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
        </VWindowItem>
  
        <VWindowItem value="shipping-families" class="m-t-sm" eager>
          <EEditableListItem
            v-model="model.shipments.families"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm"
            :disabled="disabled"
          >
            <template #default="{ removeItem, item }">
              <ESelectFamilies
                :disabled="disabled"
                v-model="item.family"
                return-object
                :rules="[required]"
              />

              <div class="flex gap-x-sm">
                <EInputPct
                  v-model="item.cost"
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
        </VWindowItem>
  
        <VWindowItem value="shipping-products" class="m-t-sm" eager>
          <EEditableListItem
            v-model="model.shipments.products"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm"
            :disabled="disabled"
          >
            <template #default="{ removeItem, item }">
              <ESelectProducts
                :disabled="disabled"
                v-model="item.product"
                return-object
                :rules="[required]"
              />

              <div class="flex gap-x-sm">
                <EInputPct
                  v-model="item.cost"
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
        </VWindowItem>
      </VWindow>
    </section>

    <VDivider class="m-y-sm" />

    <section class="grid grid-cols-4 gap-x-sm">
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
        @click="router.push({ name: 'list-costs-table' })"
        :disabled="loading"
        color="secondary"
        class="w-20"
        block
      >
        Voltar
      </VBtn>
    </section>
  </EForm>
</template>