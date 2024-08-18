<script setup lang="ts">
import type { RuleExpression } from 'vee-validate'
import { useField } from 'vee-validate'
import { MaybeRef, ref } from 'vue';
import { uploadFiles, deleteFiles } from '@/src/core/datasource/upload';
import useNotify from '../../composables/useNotify';
import { toRef, useAsyncState } from '@vueuse/core';
import { computed } from 'vue';
import { formatS3FileUrl } from '../../utils/format';

const props = defineProps<{
  name: string
  rules?: MaybeRef<RuleExpression<string | undefined>>,
  size: number
  rounded?: boolean
}>()

const notify = useNotify()

const emit = defineEmits<{
  (e: 'uploaded'): void
  (e: 'deleted'): void
}>()

const {
  value: inputValue,
  setValue,
} = useField<string | undefined>(toRef(props, 'name'), props.rules)

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
    emit('uploaded')
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
    emit('deleted')
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
  <div class="w-max">
    <template v-if="!inputValue">
      <input
        type="file"
        accept="image/*"
        class="hidden"
        ref="fileInput"
        @change="uploadFetch.execute()"
      >

      <div
        class="p-xl b-gray-4 b-3 b-dashed cursor-pointer"
        :class="{ 'rounded-full': rounded }"
        v-ripple
        @click="() => fileInput?.click()"
      >
        <VProgressCircular
          v-if="uploadFetch.isLoading.value"
          :size="`${size / 2}px`"
          color="grey-darken-2"
          :width="5"
          indeterminate
        />

        <VIcon
          v-else
          color="grey-darken-2"
          :size="`${size / 2}px`"
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
        :src="formatS3FileUrl(inputValue)"
        class="m-5"
        :width="`${size}px`"
      />
    </div>
  </div>
</template>
