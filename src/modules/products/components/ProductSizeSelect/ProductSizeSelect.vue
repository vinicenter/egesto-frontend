<script lang="ts" setup>
import { useAttrs } from 'vue';
import { getProductsSize } from '../../datasource/products-size';
import { VListItemMedia } from 'vuetify/lib/components/index.mjs';
import { reactive } from 'vue';
import { useFieldArray } from 'vee-validate';
import ProductSizeRemoveModal from './ProductSizeRemoveModal.vue';
import ProductSizeModal from './ProductSizeModal.vue';
import { ProductSize } from '../../types/productSize';

const props = defineProps<{
  name: string,
  editable?: boolean,
}>()

const editModalState = reactive({
  modelValue: false,
  productSize: undefined,
})

const openEditModal = (productSize?: ProductSize) => {
  Object.assign(editModalState, {
    modelValue: true,
    productSize,
  })
}

const removeModalState = reactive({
  modelValue: false,
  productSize: undefined,
})

const openRemoveModal = (productSize: ProductSize) => {
  Object.assign(removeModalState, {
    modelValue: true,
    productSize,
  })
}

const {
  push: pushProductSize,
  replace: replaceProductSizes,
  fields,
} = useFieldArray<ProductSize>(props.name)

const updateProductSize = (productSize: ProductSize) => {
  const index = fields.value.findIndex((field) => field.value._id === productSize._id)

  if(index === -1) return

  const newFields = [ ...fields.value ]

  newFields[index].value = productSize

  replaceProductSizes(newFields.map((field) => field.value))
}

const removeProductSizeByEntity = (productSize: ProductSize) => {
  const newFields = fields.value.filter((field) => field.value._id !== productSize._id)

  replaceProductSizes(newFields.map((field) => field.value))
}

const attrs = useAttrs()
</script>

<template>
  <div>
    <ESelectQuery
      v-bind="attrs"
      :name="name"
      label="Tamanhos"
      :show-create="editable"
      query-key="product-size"
      multiple
      :query-fn="getProductsSize"
      @create="openEditModal"
    >
      <template #item="scope">
        <VListItem v-bind="scope.props" title="">
          <VListItemMedia class="flex justify-between">
            <div class="flex items-center">
              {{ scope.item.raw.name }}
            </div>

            <div v-if="editable">
              <VBtn
                @click.prevent.stop="openEditModal(scope.item.raw)"
                icon="mdi-pencil"
                color="primary"
                size="x-small"
                title="Editar"
                variant="flat"
                class="ml-2"
              />

              <VBtn
                @click.prevent.stop="openRemoveModal(scope.item.raw)"
                icon="mdi-delete"
                color="red"
                size="x-small"
                title="Remover"
                variant="flat"
                class="ml-2"
              />
            </div>
          </VListItemMedia>
        </VListItem>
      </template>
    </ESelectQuery>

    <ProductSizeModal
      v-model="editModalState.modelValue"
      :product-size="editModalState.productSize"
      @new-product-size="pushProductSize($event)"
      @edit-product-size="updateProductSize"
    />

    <ProductSizeRemoveModal
      v-model="removeModalState.modelValue"
      :product-size="removeModalState.productSize"
      @remove-product-size="removeProductSizeByEntity"
    />
  </div>
</template>
