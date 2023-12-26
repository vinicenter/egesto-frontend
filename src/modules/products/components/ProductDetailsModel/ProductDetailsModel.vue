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
const tab = ref<'info' | 'production'>('info')

watch(() => props.modelValue, async () => {
  if(!props.modelValue || !props.id) {
    return
  }

  try {
    tab.value = 'info'

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
  <VDialog width="900" v-model="model">
    <template v-slot:default="{ isActive }">
      <VCard>
        <VToolbar
          color="primary"
          title="Visualizar produto"
        />

        <ProductDetailsSkeleton v-if="loading" />

        <template v-else>
          <VTabs grow v-model="tab" class="overflow-visible">
            <VTab value="info">
              Informações básicas
            </VTab>
            <VTab value="production">
              Produção
            </VTab>
          </VTabs>

          <div class="p-sm">
            <VWindow v-model="tab">
              <VWindowItem value="info">
                <ProductDetailsInfo :productData="productData" />
              </VWindowItem>

              <VWindowItem value="production">
                <ProductDetailsProduction :productData="productData" />
              </VWindowItem>
            </VWindow>
          </div>
        </template>

        <VCardActions class="justify-end">
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
        </VCardActions>
      </VCard>
    </template>
  </VDialog>
</template>
