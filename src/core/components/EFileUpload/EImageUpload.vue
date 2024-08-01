<script setup lang="ts">
import type { RuleExpression } from 'vee-validate'
import { useField } from 'vee-validate'
import { MaybeRef, ref } from 'vue';
import { uploadFiles, deleteFiles } from '@/src/core/datasource/upload';
import useNotify from '../../composables/useNotify';
import { useAsyncState } from '@vueuse/core';
import { computed } from 'vue';

const props = defineProps<{
  name: string
  rules?: MaybeRef<RuleExpression<string | undefined>>,
}>()

const notify = useNotify()

const {
  value: inputValue,
  setValue,
} = useField<string | undefined>(props.name, props.rules)

const fileInput = ref()
const files = computed(() => Object.values(fileInput.value?.files || {}) as File[])

const uploadPromise = () => {
  if(!files.value.length) {
    throw new Error('No file to upload')
  }

  return uploadFiles(files.value)
}

const uploadFetch = useAsyncState(uploadPromise, undefined, {
  onSuccess: (response) => {
    if(!response) {
      return
    }

    setValue(response.data.files?.[0])
  },
  onError: () => {
    notify.displayMessage({
      message: 'Falha ao fazer upload da imagem',
      type: 'error'
    })
  },
  immediate: false,
})

const deletePromise = () => {
  if(!inputValue.value) {
    throw new Error('No file to delete')
  }

  return deleteFiles([ inputValue.value ])
}

const deleteFetch = useAsyncState(deletePromise, undefined, {
  onSuccess: () => {
    setValue(undefined)
  },
  onError: () => {
    notify.displayMessage({
      message: 'Falha ao deletar a imagem',
      type: 'error'
    })
  },
  immediate: false,
})
</script>

<template>
  <div class="w-250px flex flex-col items-center">
    <template v-if="!inputValue">
      <input
        type="file"
        accept="image/*"
        class="hidden"
        ref="fileInput"
        @change="uploadFetch.execute()"
      >

      <div
        class="rounded-full p-xl b-gray-4 b-3 b-dashed cursor-pointer"
        v-ripple
        @click="() => fileInput?.click()"
      >
        <VProgressCircular
          v-if="uploadFetch.isLoading.value"
          size="100px"
          color="grey-darken-2"
          :width="5"
          indeterminate
        />

        <VIcon
          v-else
          color="grey-darken-2"
          size="100px"
        >
        mdi-image-outline
        </VIcon>
      </div>
    </template>

    <div class="relative" v-else>
      <div class="absolute z-10 top-0 right-0">
        <VBtn
          color="red"
          icon="mdi-trash-can"
          @click="deleteFetch.execute()"
          :loading="deleteFetch.isLoading.value"
        />
      </div>

      <VImg
        :src="inputValue"
        class="m-5"
        width="200px"
      />
    </div>
  </div>
</template>
