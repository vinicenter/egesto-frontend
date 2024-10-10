<script setup lang="ts">
import { useForm } from 'vee-validate';
import { required } from '@/src/core/utils/form-validator';
import useNotify from '@/src/core/composables/useNotify';
import { createProductSize, updateProductSize } from '../../datasource/products-size';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { watch } from 'vue';
import { ProductSize, ProductSizeForm } from '../../types/productSize';
import { computed } from 'vue';

const props = defineProps<{
  productSize?: ProductSize
}>()

const emit = defineEmits<{
  (e: 'newProductSize', data: ProductSize): void
  (e: 'editProductSize', data: ProductSize): void
}>()

const modelValue = defineModel<boolean>();

const { displayMessage } = useNotify()
const queryClient = useQueryClient()

const getInitialValues = () => {
  return props.productSize ? {
    name: props.productSize.name,
  } : {
    name: ''
  }
}

const {
  handleSubmit,
  setValues,
} = useForm<ProductSizeForm>({
  initialValues: getInitialValues()
})

watch(modelValue, (isOpen) => {
  if(isOpen) {
    setValues(getInitialValues())
  }
})

const createProductSizeMutation = useMutation({
  mutationFn: (data: ProductSizeForm) => createProductSize(data),
  onSuccess: (data) => {
    displayMessage({
      message: 'Tamanho criado com sucesso',
      type: 'success'
    })

    emit('newProductSize', data)
    queryClient.invalidateQueries(['product-size'])

    modelValue.value = false
  },
  onError: () => {
    displayMessage({
      message: 'Erro ao criar tamanho',
      type: 'error'
    })
  }
})

const updateProductSizeMutation = useMutation({
  mutationFn: (data: ProductSizeForm) => updateProductSize(props.productSize!._id, data),
  onSuccess: (data) => {
    displayMessage({
      message: 'Tamanho atualizado com sucesso',
      type: 'success'
    })

    emit('editProductSize', data!)
    queryClient.invalidateQueries(['product-size'])

    modelValue.value = false
  },
  onError: () => {
    displayMessage({
      message: 'Erro ao atualizar tamanho',
      type: 'error'
    })
  }
})

const submit = handleSubmit(async (values) => {
  if(props.productSize) {
    updateProductSizeMutation.mutate(values)
  }
  else {
    createProductSizeMutation.mutate(values)
  }
})

const loading = computed(() => createProductSizeMutation.isLoading.value || updateProductSizeMutation.isLoading.value)
</script>

<template>
  <EDialog
    v-model="modelValue"
    title="Tamanho"
    width="450"
  >
    <template #default>
      <form
        id="product-size-form"
        @submit.prevent="submit"
      >
      <div class="p-sm flex flex-col gap-2">
        <EInputText name="name" label="Nome" :rules="required" />
      </div>
      </form>
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
        type="submit"
        form="product-size-form"
        :loading="loading"
      >
        Salvar
      </VBtn>
    </template>
  </EDialog>
</template>
