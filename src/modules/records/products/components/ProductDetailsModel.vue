<script setup lang="ts">
import { getProduct } from '../datasource/products'
import useNotify from '@/src/core/composables/useNotify'
import { computed, ref, watch } from 'vue';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { formatProductNameWithCode } from '../utils/formatter'
import { priceFormat, numberFormat } from '~utils/format';
import { IProduct } from '../types/product'

const { displayMessage } = useNotify()
const { format } = numberFormat();
const { formatPrice } = priceFormat();

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

watch(() => props.modelValue, async () => {
  if(!props.modelValue || !props.id) {
    return
  }

  try {
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
        <VCardText>
          <VSkeletonLoader type="card" v-if="loading" />

          <template v-else>
            <div class="space-y-sm">
              <div class="grid grid-cols-3 gap-sm">
                <div>
                  <div>Nome</div>
                  {{ formatProductNameWithCode(productData?.name, productData?.code) }}
                </div>

                <div>
                  <div>Familia</div>
                  {{ productData?.family?.name || '-' }}
                </div>

                <div>
                  <div>Marca</div>
                  {{ productData?.brand?.name || '-' }}
                </div>
              </div>

              <div class="grid grid-cols-5 gap-sm">
                <div>
                  <div>Quantidade por pack</div>
                  {{ format(productData?.pack?.numberOfUnitsInPack) }}
                </div>

                <div>
                  <div>Peso por unidade</div>
                  {{ format(productData?.unit?.weight) }}
                </div>

                <div>
                  <div>Peso por pack</div>
                  {{ format(productData?.pack?.weight) }}
                </div>

                <div>
                  <div>Custo por unidade</div>
                  {{ formatPrice(productData?.production?.cost?.unitCost) }}
                </div>

                <div>
                  <div>Custo por pack</div>
                  {{ formatPrice(productData?.production?.cost?.packCost) }}
                </div>
              </div>

              <div class="grid grid-cols-3 gap-sm">
                <div>
                  <div>EAN-13</div>
                  {{ productData?.unit?.barcodeEan13 || '-' }}
                </div>

                <div>
                  <div>DUN-14</div>
                  {{ productData?.pack?.barcodeDun14 || '-' }}
                </div>

                <div>
                  <div>Packs no palete</div>
                  {{ productData?.pack?.numberOfPacksInPallet || '-' }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-sm">
                <div>
                  <div>NCM</div>
                  {{ productData?.taxes?.ncm || '-' }}
                </div>

                <div>
                  <div>CEST</div>
                  {{ productData?.taxes?.cest || '-' }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-sm">
                <div>
                  <div>Volume por produção</div>
                  {{ format(productData?.production?.cost?.weightPerFormulation) }}
                </div>
                <div>
                  <div>Perda</div>
                  {{ format(productData?.production?.lost) }}
                </div>
              </div>

              <VAlert
                density="compact"
                color="info"
                title="Publicidade"
              >
                <div v-if="productData?.marketing?.isPublic">
                  <VIcon icon="mdi-lock-open" />
                  Produto Público - Aparece no site
                </div>

                <div v-else>
                  <VIcon icon="mdi-lock" />
                  Produto Privado - Não aparece no site
                </div>

                <div v-if="productData?.marketing?.color">
                  Cor: {{ productData?.marketing?.color }}
                </div>

                <div v-if="productData?.marketing?.description">
                  {{ productData?.marketing?.description }}
                </div>
              </VAlert>
            </div>
          </template>
        </VCardText>
        <VCard-actions class="justify-end">
          <VBtn
            variant="text"
            @click="isActive.value = false"
          >
            Fechar
          </VBtn>
        </VCard-actions>
      </VCard>
    </template>
  </VDialog>
</template>
