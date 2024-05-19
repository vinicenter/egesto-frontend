<script setup lang="ts">
import type { IProduct } from '../../types/product';
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { generateProductDescriptionAi } from '@/src/modules/products/datasource/products';
import { useFormValues, useSetFieldValue } from 'vee-validate';
import { ref } from 'vue';
import { formatFamilyLabel } from '../../utils/formatter';

const { displayMessage } = useNotify();

defineProps<{
  disabled: boolean;
}>();

const formValues = useFormValues<IProduct.Root>()

const setDescriptionField = useSetFieldValue<string>('marketing.description')

const loadingDescriptionGeneration = ref(false)

const generateDescriptionWithAi = async () => {
  try {
    loadingDescriptionGeneration.value = true

    const data = await generateProductDescriptionAi({
      productFamily: formatFamilyLabel(formValues.value.family),
      productName: formValues.value.name,
      brandDescription: formValues.value.brand?.description,
      brandName: formValues.value.brand?.name,
      oldProductDescription: formValues.value.marketing?.description,
    })

    setDescriptionField(data)

    displayMessage({
      message: 'Descrição gerada com IA!',
      type: 'success'
    })
  } catch {
    displayMessage({
      message: 'Erro ao gerar a descrição',
      type: 'error'
    })
  } finally {
    loadingDescriptionGeneration.value = false
  }
}
</script>

<template>
  <section>
    <div class="font-bold">Marketing</div>

    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 gap-4">
        <ETextarea
          name="marketing.description"
          label="Descrição"
          hint="Esta descrição será exibida no site, caso o produto seja público."
          persistent-hint
          :disabled="disabled"
          :loading="loadingDescriptionGeneration"
        />
  
        <div class="w-400px">
          <ESelect
            name="marketing.isPublic"
            :disabled="disabled"
            :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
            :return-object="false"
            :clearable="false"
            hint="Se o produto for público, ele será exibido no site."
            persistent-hint
            item-title="label"
            label="Produto público"
            :rules="[required]"
          />
        </div>
      </div>
  
      <div class="flex">
        <VTooltip
          text="Gerar descrição com Inteligência Artificial"
          location="top"
          open-on-click
        >
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <VMenu
                :close-on-content-click="false"
                location="center"
              >
                <template #activator="{ props: propsActivateMenu }">
                  <VBtn
                    v-bind="propsActivateMenu"
                    color="primary"
                    :disabled="disabled"
                    icon="mdi-brain"
                  />
                </template>
  
                <template #default>
                  <VCard>
                    <VCardTitle>
                      Deseja continuar?
                    </VCardTitle>
  
                    <VCardSubtitle>
                      A descrição atual será limpa e<br> preenchida com uma nova descrição gerada.
                    </VCardSubtitle>
  
                    <VCardActions class="flex justify-center">
                      <VBtn
                        color="primary"
                        variant="flat"
                        prepend-icon="mdi-brain"
                        :loading="loadingDescriptionGeneration"
                        @click="generateDescriptionWithAi"
                      >
                        Gerar com IA
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </template>
              </VMenu>
            </div>
          </template>
        </VTooltip>
  
        <VTooltip
          text="Defina a cor usada para o produto"
          location="top"
          open-on-click
        >
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <EColorPicker
                title="Cor"
                name="marketing.color"
                :disabled="disabled"
                :modes="['hex']"
              />
            </div>
          </template>
        </VTooltip>
      </div>
    </div>
  </section>
</template>