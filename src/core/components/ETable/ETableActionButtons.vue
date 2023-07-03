<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string,
  page: string,
  edit: boolean,
  clone: boolean,
  delete: boolean
}>()

const router = useRouter()

const goTo = (type: string) => {
  const paths: Record<string, string> = {
    edit: `edit-${props.page}`,
    clone: `clone-${props.page}`,
    delete: `delete-${props.page}`,
  }

  router.push({name: paths[type], params: { id: props.id } })
}
</script>

<template>
  <div class="space-x-sm">
    <VBtn
      v-if="edit"
      color="primary"
      size="small"
      title="Editar"
      @click="goTo('edit')"
      icon="mdi-pencil"
    />

    <VBtn
      v-if="clone"
      color="primary"
      size="small"
      title="Clonar"
      @click="goTo('clone')"
      icon="mdi-content-copy"
    />

    <VBtn
      v-if="delete"
      color="red"
      size="small"
      title="Excluir"
      @click="goTo('delete')"
      icon="mdi-trash-can"
    />
  </div>
</template>