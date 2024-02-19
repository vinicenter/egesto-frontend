<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { getFamilies } from '../../datasource/families';
import { IFamily } from '../../types/family';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const columns = [
  {
    label: 'Nome',
    style: 'width: 100px',
    orderByValue: 'name',
    defaultOrderByValue: true
  },
  {
    label: '',
    style: 'width: 100px',
  },
]

defineOptions({
  name: 'FamiliesList'
})

const subFamilyModal = computed(() => route.query.subFamilyModal === 'true')
const mainFamilyId = computed(() => route.query.mainFamilyId)
const mainFamilyName = computed(() => route.query.mainFamilyName)

const openSubfamilyModal = (item: IFamily) => {
  router.push({
    query: {
      subFamilyModal: 'true',
      mainFamilyId: item._id,
      mainFamilyName: item.name
    }
  })
}

const closeSubfamilyModal = () => router.push({})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getFamilies"
    query-key="families"
    :query-variables="{ familyType: 'main' }"
    @new="router.push({ name: 'family', params: { id: 'novo', type: 'criar' }, query: { type: 'main' }})"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
      <td>
        <VBtn @click="openSubfamilyModal(item)">
          Subfamílias
        </VBtn>
      </td>
    </template>

    <template #menu>
      <FamiliesDefaultCostsModal />
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        clone
        page="family"
      />
    </template>
  </ETableGenericList>

  <FamiliesSubfamiliesModal
    :model-value="subFamilyModal"
    :mainFamilyId="mainFamilyId"
    :mainFamilyName="mainFamilyName"
    @update:model-value="closeSubfamilyModal"
  />
</template>

<route lang="yaml">
name: list-families
meta:
  title: Famílias
</route>
