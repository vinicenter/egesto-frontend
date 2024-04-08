<script setup lang="ts">
import { useForm } from 'vee-validate';
import { IBillTagRoot } from '../../types/bill-tags';
import { required } from '@/src/core/utils/form-validator';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { createBillTag, updateBillTag } from '../../datasource/bill-types';
import { useQueryClient } from '@tanstack/vue-query';
import { watch } from 'vue';
import { generateRandomHexColor } from '@/src/core/utils/utils';

const props = defineProps<{
  billTagData?: IBillTagRoot
}>()

const emit = defineEmits<{
  (e: 'newTag', data: IBillTagRoot): void
  (e: 'editTag', data: IBillTagRoot): void
}>()

const modelValue = defineModel<boolean>();

const { displayMessage } = useNotify()
const queryClient = useQueryClient()

const getInitialValues = () => {
  return props.billTagData ? {
    name: props.billTagData.name,
    color: props.billTagData.color,
    description: props.billTagData.description
  } : {
    color: generateRandomHexColor()
  }
}

const {
  handleSubmit,
  setValues,
} = useForm<IBillTagRoot>({
  initialValues: getInitialValues()
})

watch(modelValue, (isOpen) => {
  if(isOpen) {
    setValues(getInitialValues())
  }
})

const loading = ref(false)

const submit = handleSubmit(async (values) => {
  try {
    loading.value = true

    if(!props.billTagData?._id) {
      const data = await createBillTag(values)
  
      emit('newTag', data)
    }
    else {
      const data = await updateBillTag(props.billTagData._id, values)

      emit('editTag', data)
    }

    await queryClient.invalidateQueries(['bills-tag'])

    displayMessage({
      message: 'Tag salva com sucesso',
      type: 'success'
    })

    modelValue.value = false
  } catch {
    displayMessage({
      message: 'Erro ao salvar tag',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <EDialog
    v-model="modelValue"
    title="Tag"
    width="900"
  >
    <template #default>
      <form id="bill-tag-form" @submit.prevent="submit">
        <div class="p-sm flex flex-col">
          <div class="flex items-start">
            <EInputText name="name" label="Nome" :rules="required" />
            <EColorPicker title="Cor" name="color" :rules="required" />
          </div>

          <ETextarea name="description" label="Descrição" />
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
        form="bill-tag-form"
        :loading="loading"
      >
        Salvar
      </VBtn>
    </template>
  </EDialog>
</template>
