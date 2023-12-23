<script lang="ts" setup>
import type { IFamily } from '../types/family';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';
import EInputText from '@/src/core/components/EInput/EInputText.vue';

const router = useRouter();

const props = defineProps<{
  disabled: boolean,
  buttonLabel: string | undefined,
  loading: boolean;
  initialValues?: IFamily;
}>();

const form = useForm<IFamily>({
  initialValues: props.initialValues
})

const emit = defineEmits<{
  (e: 'submit', value: IFamily): void;
}>();

const submit = form.handleSubmit(async (values) => {
  emit('submit', values);
})

const disabled = computed(() => props.loading || props.disabled);

const loadCostsFromFamily = async (family: IFamily) => {
  if(family?.costs) {
    form.setFieldValue('costs', family.costs)
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-x-sm">
      <EInputText
        name="name"
        :disabled="disabled"
        label="Nome"
        :rules="[required]"
      />

      <ESelectFamilies
        name="copyFromFamily"
        :disabled="disabled"
        label="Selecione uma família para copiar custos"
        @update:model-value="loadCostsFromFamily($event);"
        return-object
      />

      <VDivider class="m-y-sm" />

      <div class="font-bold">Custos</div>

      <EEditableListItem
        name="costs"
        class="grid grid-cols-1 md:grid-cols-2 gap-x-sm"
        :disabled="disabled"
      >
        <template #default="{ index, removeItem }">
          <EInputText
            :name="`costs.${index}.name`"
            :disabled="disabled"
            label="Nome"
            :rules="[required]"
          />

          <div class="flex gap-x-sm">
            <EInputPct
              :name="`costs.${index}.value`"
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
        @click="router.push({ name: 'list-families' })"
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