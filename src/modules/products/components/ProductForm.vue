<script lang="ts" setup>
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import type { IProduct } from '../types/product';
import { required } from '@/src/core/utils/form-validator';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

const router = useRouter();

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
});
</script>

<template>
  <form @submit.prevent="submit">
    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
        <EInputText
          name="code"
          :disabled="disabled"
          label="Código"
          :rules="[required]"
        />

        <EInputText
          name="name"
          :disabled="disabled"
          label="Nome"
          :rules="[required]"
        />

        <ESelectFamilies
          name="family"
          :disabled="disabled"
          return-object
        />

        <ESelectBrands
          name="brand"
          :disabled="disabled"
          return-object
        />
      </div>


      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-sm">
        <EInputText
          name="pack.numberOfUnitsInPack"
          :disabled="disabled"
          type="number"
          label="Unidades por pack"
        />

        <EInputText
          name="unit.weight"
          :disabled="disabled"
          type="number"
          label="Peso unitário"
        />

        <EInputText
          name="pack.numberOfPacksInPallet"
          :disabled="disabled"
          type="number"
          label="Quantidade de pack no pallet"
        />

        <EInputText
          name="UnitOfMeasurement"
          :disabled="disabled"
          label="Unidade de medida"
        />
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
        <EInputText
          name="unit.barcodeEan13"
          :disabled="disabled"
          label="EAN-13"
        />

        <EInputText
          name="pack.barcodeDun14"
          :disabled="disabled"
          label="DUN-14"
        />

        <EInputText
          name="taxes.cest"
          :disabled="disabled"
          label="CEST"
        />

        <EInputText
          name="taxes.ncm"
          :disabled="disabled"
          label="NCM"
        />
      </div>
    </section>

    <VDivider class="m-y-sm" />

    <section class="space-y-4">
      <div class="font-bold">Marketing</div>

      <div class="flex">
        <ESelect
          name="marketing.isPublic"
          :disabled="disabled"
          :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
          :return-object="false"
          hint="Se o produto for público, ele será exibido no site."
          persistent-hint
          item-title="label"
          label="Produto público"
        />

        <EColorPicker
          name="marketing.color"
          title="asdas"
          :disabled="disabled"
          :modes="['hex']"
        />
      </div>

      <ETextarea
        name="marketing.description"
        label="Descrição"
        hint="Esta descrição será exibida no site, caso o produto seja público."
        persistent-hint
        :disabled="disabled"
      />
    </section>

    <VDivider class="m-y-sm" />

    <section>
      <div class="font-bold">Produção</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-sm">
        <EInputPct
          name="production.lost"
          :disabled="disabled"
          label="Perda de produção"
        />
      </div>
    </section>

    <VDivider class="m-y-sm" />

    <section>
      <div class="font-bold">Formulação</div>

      <EEditableListItem
        name="production.formulation"
        class="grid grid-cols-1 md:grid-cols-3 gap-x-sm"
        :disabled="disabled"
      >
        <template #default="{ index, removeItem }">
          <ESelectFeedstocks
            :name="`production.formulation.${index}.feedstock`"
            :disabled="disabled"
            return-object
            :rules="[required]"
          />

          <EInputText
            :name="`production.formulation.${index}.value`"
            :disabled="disabled"
            type="number"
            label="Volume usado"
            :rules="[required]"
          />

          <div class="flex gap-x-sm">
            <ESelect
              :name="`production.formulation.${index}.considerInWeightCalculation`"
              item-title="label"
              :return-object="false"
              :disabled="disabled"
              :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
              label="Considerar no cálculo de peso"
              :rules="[required]"
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