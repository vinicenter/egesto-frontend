<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { getFamiliesDefaultCost, updateFamiliesDefaultCost } from '../datasource/families';
import useNotify from '@/src/core/composables/useNotify';
import { useQueryClient } from '@tanstack/vue-query';

const isActive = ref(false)

const queryClient = useQueryClient()

const { displayMessage } = useNotify()

const { setValues, handleSubmit } = useForm();

const loadingLoadData = ref(false);
const errorLoadData = ref(false);

const loadingSaveData = ref(false);

const loadData = async () => {
  try {
    errorLoadData.value = false;
    loadingLoadData.value = true;

    const data = await getFamiliesDefaultCost();
    setValues(data);
  } catch {
    errorLoadData.value = true;

    displayMessage({
      type: 'error',
      message: 'Não foi possível carregar os custos padrões da família'
    })
  } finally {
    loadingLoadData.value = false;
  }
}

watch(isActive, (value) => {
  if (value) {
    loadData();
  }
})

const submit = handleSubmit(async (values) => {
  try {
    loadingSaveData.value = true;

    const valuesFormatted = {
      costs: values.costs.map((cost: any) => ({
        name: cost.name,
        value: Number(cost.value)
      }))
    }

    await updateFamiliesDefaultCost(valuesFormatted);

    displayMessage({
      type: 'success',
      message: 'Dados salvos com sucesso'
    })

    isActive.value = false;

    queryClient.invalidateQueries(['families-default-costs'])
  } catch {
    displayMessage({
      type: 'error',
      message: 'Não foi possível salvar os custos padrões da família'
    })
  } finally {
    loadingSaveData.value = false;
  }
})
</script>

<template>
    <VDialog v-model="isActive" width="700px">
      <template #activator="{ props }">
        <VBtn v-bind="props" color="teal">
          Custos padrões
        </VBtn>
      </template>

      <template #default>
        <VCard>
          <VToolbar
            color="primary"
            title="Custos padrões da família"
          />

          <VCardText>
            <div class="text-lg">
              Defina os custos padrões da família
            </div>
            
            <VDivider class="m-y-sm" />

            <template v-if="loadingLoadData">
              <VSkeletonLoader type="list-item" />
              <VSkeletonLoader type="list-item" />
              <VSkeletonLoader type="list-item" />
              <VSkeletonLoader type="list-item" />
              <VSkeletonLoader type="list-item" />
            </template>

            <EError
              v-else-if="errorLoadData"
              @refetch="loadData"
            />

            <form v-else @submit.prevent="submit" id="families-default-cost-form">
              <EEditableListItem
                name="costs"
                class="grid grid-cols-1 md:grid-cols-2 gap-x-sm"
                :disabled="false"
              >
                <template #default="{ index, removeItem }">
                  <EInputText
                    :name="`costs.${index}.name`"
                    label="Nome"
                    :rules="[required]"
                  />
  
                  <div class="flex gap-x-sm">
                    <EInputPct
                      :name="`costs.${index}.value`"
                      :rules="[required]"
                      label="Custo (%)"
                    />
  
                    <VBtn
                      color="red"
                      @click="removeItem"
                      icon="mdi-trash-can"
                    />
                  </div>
                </template>
              </EEditableListItem>
            </form>
          </VCardText>

          <VCardActions class="justify-end">
            <VBtn
              variant="elevated"
              color="red"
              @click="isActive = false"
            >
              Fechar
            </VBtn>

            <VBtn
              variant="elevated"
              color="primary"
              type="submit"
              form="families-default-cost-form"
              :disabled="loadingLoadData || errorLoadData"
              :loading="loadingSaveData"
            >
              Salvar
            </VBtn>
          </VCardActions>
        </VCard>
      </template>
    </VDialog>
</template>
