<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getProducts, generateProductReport } from '../../datasource/products';
import { ref } from 'vue';
import { formatS3FileUrl, priceFormat } from '@/src/core/utils/format';
import { formatFamilyLabel, formatSizesLabel } from '../../utils/formatter';
import { downloadBlob } from '@/src/core/utils/utils';
import useNotify from '@/src/core/composables/useNotify';
import { reactive } from 'vue';
import { IProduct } from '../../types/product';

const router = useRouter();
const { formatPrice } = priceFormat();

const notify = useNotify();

const columns = [
  { label: 'Código', style: 'width: 100px', orderByValue: 'code' },
  { label: 'Nome', style: 'width: 200px', orderByValue: 'name', defaultOrderByValue: true },
  { label: 'Tamanhos', style: 'width: 100px' },
  { label: 'Família', style: 'width: 100px' },
  { label: 'Unidade por Pack', style: 'width: 100px' },
  { label: 'Custo unitário', style: 'width: 100px' },
  { label: 'Custo total', style: 'width: 100px' },
  { label: '', style: 'width: 100px' },
]

const viewId = ref(null)

const closeView = (open = false) => {
  if(!open) {
    viewId.value = null
  }
}

defineOptions({
  name: 'ProductList',
  inheritAttrs: false,
})

const reportLoading = ref(false);

const generateReport = async () => {
  try {
    reportLoading.value = true;

    const csvBlob = await generateProductReport()

    downloadBlob(csvBlob, `Relatório Produtos`, 'csv');
  } catch (e) {
    notify.displayMessage({
      type: 'error',
      message: 'Erro ao exportar',
    });
  } finally {
    reportLoading.value = false;
  }
}

const queryVariables = reactive<Partial<IProduct.Filters>>({
  onlyFeedstockEnabled: undefined,
  brandId: undefined,
  familyId: undefined
})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getProducts"
    query-key="products"
    :query-variables="queryVariables"
    @new="router.push({ name: 'product', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.code || '-' }}</td>
      <td>
        <div class="flex items-center gap-2">
          <img
            v-if="item.marketing?.photos?.length"
            :src="formatS3FileUrl(item.marketing.photos[0])"
            :height="60"
          />
          <div>{{ item.name || '-' }}</div>
        </div>
      </td>
      <td>{{ formatSizesLabel(item.sizes) }}</td>
      <td>{{ formatFamilyLabel(item.family) }}</td>
      <td>{{ item.pack?.numberOfUnitsInPack || '-' }}</td>
      <td>{{ item.productionCost?.unitCost ? formatPrice(item.productionCost?.unitCost) : '-' }}</td>
      <td>{{ item.productionCost?.packCost ? formatPrice(item.productionCost?.packCost) : '-' }}</td>
      <td>
        <span class="space-x-4 flex">
          <VTooltip location="top" open-on-click>
            <template v-slot:activator="{ props }">
              <VIcon
                v-bind="props"
                :class="item.marketing.isPublic ? 'text-green' : 'text-red'"
              >
                mdi-bullhorn-outline
              </VIcon>
            </template>

            <div class="flex flex-col items-center">
              <template v-if="item.marketing.isPublic">
                <span>Produto público</span>
                <span>Está sendo exibido no site</span>
              </template>
  
              <template v-else>
                <span>Produto privado</span>
                <span>Não está sendo exibido no site</span>
              </template>
            </div>
          </VTooltip>

          <VTooltip location="top" open-on-click>
            <template v-slot:activator="{ props }">
              <VIcon
                v-bind="props"
                :class="item.productionCost.isWeightPerFormulationValid ? 'text-green' : 'text-red'"
              >
                mdi-check
              </VIcon>
            </template>

            <div v-if="item.productionCost.isWeightPerFormulationValid">
              Formulação válida
            </div>

            <div v-else>
              Formulação inválida
            </div>
          </VTooltip>
        </span>
      </td>
    </template>

    <template #menu>
      <VBtn
        color="purple"
        :loading="reportLoading"
        @click="generateReport"
      >
        Exportar todos em CSV
      </VBtn>

      <ProductFilters v-model="queryVariables" />
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        clone
        view
        page="product"
        @view="viewId = $event"
      />
    </template>

  </ETableGenericList>

  <ProductDetailsModel
    :model-value="!!viewId"
    :id="viewId"
    @update:model-value="closeView"
  />
</template>

<route lang="yaml">
name: list-products
meta:
  title: Produtos
</route>
