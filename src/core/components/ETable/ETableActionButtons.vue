<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  id: string,
  page: string,
  edit?: boolean,
  clone?: boolean,
  delete?: boolean,
  view?: boolean,
  queryParams?: Record<string, any>,
}>(), {
  edit: false,
  clone: false,
  delete: false,
  view: false,
})

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'navigate'): void
}>()

const router = useRouter()

const items = [
  { title: 'Visualizar', action: 'view', visible: props.view },
  { title: 'Editar', action: 'edit', visible: props.edit },
  { title: 'Clonar', action: 'clone', visible: props.clone },
  { title: 'Excluir', action: 'delete', visible: props.delete },
]

const itemsFiltered = items.filter(item => item.visible)

const goTo = (type: string) => {
  emit('navigate')

  const paths: Record<string, Function> = {
    edit: () => router.push({ name: props.page, params: { id: props.id, type: 'editar' }, query: props.queryParams }),
    clone: () => router.push({ name: props.page, params: { id: props.id, type: 'clonar' }, query: props.queryParams }),
    delete: () => router.push({ name: props.page, params: { id: props.id, type: 'deletar' }, query: props.queryParams }),
    view: () => emit('view', props.id),
  }

  paths[type]()
}
</script>

<template>
  <VMenu>
    <template v-slot:activator="{ props }">
      <VBtn color="primary" size="small" icon="mdi-dots-vertical" v-bind="props"></VBtn>
    </template>

    <VList>
      <VListItem
        v-for="(item, i) in itemsFiltered"
        :key="i"
        @click="goTo(item.action)"
      >
        <VListItemTitle>{{ item.title }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>
