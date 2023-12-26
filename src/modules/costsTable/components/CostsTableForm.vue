<script lang="ts" setup>
import { useForm } from 'vee-validate';
import type { ICostsTable } from '../types/costsTable';
import { required } from '@/src/core/utils/form-validator';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import useNotify from '@/src/core/composables/useNotify';

const router = useRouter();
const { displayMessage } = useNotify();

const props = defineProps<{
  disabled: boolean;
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues: ICostsTable.Root;
}>();

const emit = defineEmits<{
  (e: 'submit', values: ICostsTable.Root): void,
}>();

const disabled = computed(() => props.loading || props.disabled);

const form = useForm({
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


const tab = ref('taxes');
</script>

<template>
  <form @submit.prevent="submit">
    <section>
      <div>
        <EInputText
          name="name"
          :disabled="disabled"
          label="Identificador"
          :rules="[required]"
        />
      </div>
    </section>

    <VDivider />

    <section>
      <VTabs grow v-model="tab">
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
            name="taxes"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm"
            :disabled="disabled"
          >
            <template #default="{ index, removeItem }">
              <EInputText
                :name="`taxes.${index}.name`"
                :disabled="disabled"
                label="Nome"
                :rules="[required]"
              />

              <div class="flex gap-x-sm">
                <EInputPct
                  :name="`taxes.${index}.cost`"
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
            name="shipments.families"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm"
            :disabled="disabled"
          >
            <template #default="{ removeItem, index }">
              <ESelectFamilies
                :name="`shipments.families.${index}.family`"
                :disabled="disabled"
                return-object
                :rules="[required]"
              />

              <div class="flex gap-x-sm">
                <EInputPct
                  :name="`shipments.families.${index}.cost`"
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
            name="shipments.products"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm"
            :disabled="disabled"
          >
            <template #default="{ removeItem, index }">
              <ESelectProducts
                :name="`shipments.products.${index}.product`"
                :disabled="disabled"
                return-object
                :rules="[required]"
              />

              <div class="flex gap-x-sm">
                <EInputPct
                  :name="`shipments.products.${index}.cost`"
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
        @click="router.push({ name: 'list-costs-table' })"
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