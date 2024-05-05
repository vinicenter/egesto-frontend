<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getPeople, generatePeopleReport } from '../../datasource/people';
import { downloadBlob } from '@/src/core/utils/utils';
import useNotify from '@/src/core/composables/useNotify';
import { ref } from 'vue';

const router = useRouter();
const notify = useNotify();

const columns = [
  {
    label: 'Razão Social',
    style: 'width: 200px',
    orderByValue: 'corporateName',
    defaultOrderByValue: true,
  },
  { label: 'Documento', style: 'width: 100px' },
  { label: 'Cidade', style: 'width: 100px' },
  { label: 'Estado', style: 'width: 100px' }
]

const reportLoading = ref(false);

const generateReport = async () => {
  try {
    reportLoading.value = true;

    const csvBlob = await generatePeopleReport()

    downloadBlob(csvBlob, `Relatório Pessoas`, 'csv');
  } catch (e) {
    notify.displayMessage({
      type: 'error',
      message: 'Erro ao exportar',
    });
  } finally {
    reportLoading.value = false;
  }
}

defineOptions({
  name: 'PeopleList'
})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getPeople"
    query-key="people"
    @new="router.push({ name: 'person', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.corporateName || '-' }}</td>
      <td>{{ item.document || '-' }}</td>
      <td>{{ item.address?.city || '-' }}</td>
      <td>{{ item.address?.federativeUnit || '-' }}</td>
    </template>

    <template #menu>
      <VBtn
        color="purple"
        :loading="reportLoading"
        @click="generateReport"
      >
        Exportar todos em CSV
      </VBtn>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="person"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-people
meta:
  title: Pessoas
</route>
