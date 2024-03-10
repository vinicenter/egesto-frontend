<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getFamilies, getFamiliesDefaultCost } from '../../../datasource/families';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

const props = defineProps<{
  mainFamilyId?: string
  mainFamilyName?: string
}>()

const modelValue = defineModel<boolean>();

const router = useRouter();

const columns = [
  {
    label: 'Nome',
    style: 'width: 100px',
    orderByValue: 'name',
    defaultOrderByValue: true
  },
  {
    label: 'Custo total',
    style: 'width: 100px',
    tooltip: 'É a somatória de todos os custos da família mais os custos padrões',
  },
]

const { data } = useQuery({
  queryKey: [ 'families-default-costs' ],
  queryFn: getFamiliesDefaultCost,
})

const title = computed(() => props.mainFamilyName
  ? `Subfamílias de ${props.mainFamilyName}`
  : 'Subfamilias'
)

const newFamily = () => {
  modelValue.value = false

  router.push({
    name: 'family',
    params: {
      id: 'novo',
      type: 'criar'
    },
    query: {
      mainFamilyId: props.mainFamilyId,
      mainFamilyName: props.mainFamilyName
    }
  })
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    fullscreen
    content-class="w-full flex items-end"
    close-on-back
    transition="scroll-x-reverse-transition"
  >
    <VCard class="w-50vw md:min-w-0!">
      <VToolbar
        dark
        color="primary"
        :title="title"
      >
        <VBtn
          icon
          dark
          @click="modelValue = false"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <div class="p-sm">
        <ETableGenericList
          :columns="columns"
          :list-data-source="getFamilies"
          query-key="subfamilies"
          :query-variables="{ familyType: 'linked', mainFamily: mainFamilyId }"
          @new="newFamily"
        >
          <template #default="{ item }">
            <td>{{ item.name || '-' }}</td>
            <td><FamiliesSubfamiliesInfo :family="item" :default-costs="data.totalCosts" /></td>
          </template>

          <template #actions="{ item }">
            <ETableActionButtons
              :id="item._id"
              delete
              edit
              clone
              page="family"
              @navigate="modelValue = false"
            />
          </template>
        </ETableGenericList>
      </div>
    </VCard>
  </VDialog>
</template>