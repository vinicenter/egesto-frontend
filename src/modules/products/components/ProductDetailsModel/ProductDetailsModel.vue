<script setup lang="ts">
import { getProduct } from '../../datasource/products'
import useNotify from '@/src/core/composables/useNotify'
import { computed, ref, watch } from 'vue';
import { IProduct } from '../../types/product'
import { useRouter } from 'vue-router';

const router = useRouter()
const { displayMessage } = useNotify()

const props = defineProps<{
  id: string | null
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

type ProductData = IProduct.Root | undefined

const productData = ref<ProductData>(undefined)
const loading = ref(false)
const formulationTab = ref<'products' | 'feedstocks'>('feedstocks')

watch(() => props.modelValue, async () => {
  if(!props.modelValue || !props.id) {
    return
  }

  try {
    formulationTab.value = 'feedstocks'

    loading.value = true
    const data = await getProduct(props.id)

    productData.value = data
  } catch (error) {
    displayMessage({ message: 'Erro ao carregar os dados do produto', type: 'error' })

    emit('update:modelValue', false)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <EDialog width="900" v-model="model" title="Visualizar produto">
    <template #default>
      <VCard>
        <ProductDetailsSkeleton v-if="loading" />

        <section class="min-h-300px overflow-visible" v-else>
          <div class="p-sm">
            <ProductDetailsInfo :productData="productData" />

            <VDivider class="my-4" />

            <ProductDetailsMarketing :productData="productData" />

            <VDivider class="my-4" />

            <ProductDetailsProduction :productData="productData" />

          </div>

          <VTabs grow v-model="formulationTab" class="overflow-visible">
            <VTab value="feedstocks">
              Matérias primas
            </VTab>
            <VTab value="products" :disabled="productData?.production.canBeFeedstock">
              Produtos
            </VTab>
          </VTabs>

          <div>
            <VWindow v-model="formulationTab">
              <VWindowItem value="feedstocks">
                <ProductDetailsProductionFeedstocks :productData="productData" />
              </VWindowItem>

              <VWindowItem value="products">
                <ProductDetailsProductionProducts :productData="productData" />
              </VWindowItem>
            </VWindow>
          </div>
        </section>
      </VCard>
    </template>

    <template #actions="{ isActive }">
      <VBtn
        variant="text"
        @click="isActive.value = false"
      >
        Fechar
      </VBtn>

      <VBtn
        variant="flat"
        color="primary"
        @click="router.push({ name: 'product', params: { id: productData?._id, type: 'editar' } })"
      >
        Editar
      </VBtn>
    </template>
  </EDialog>
</template>
