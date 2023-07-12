<script lang="ts" setup>
import { useRouter } from 'vue-router';
import EGenericIdView from '../../../../../core/components/EGeneric/EGenericIdView.vue'
import { createFamily, deleteFamily, getFamily, updateFamily } from '../../datasource/families'
import { reactive } from 'vue';
import { IFamily } from '../../types/family'

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive<IFamily>({
  name: '',
  costs: [],
})

const loadModel = (data: IFamily) => {
  model.name = data.name;
  model.costs = data.costs;
}

const formatSubmit = async (data: IFamily) => {
  return {
    name: data.name,
    costs: data.costs.map((cost) => {
      return {
        name: cost.name,
        value: Number(cost.value)
      }
    }),
  }
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :create-fn="createFamily"
    :delete-fn="deleteFamily"
    :get-fn="getFamily"
    :update-fn="updateFamily"
    :format-submit-fn="formatSubmit"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-families' })"
  >
    <template #default="{ loading, submit }">
      <RouterView
        :loading="loading"
        :model="model"
        @submit="submit"
      />
    </template>
  </EGenericIdView>
</template>

<route lang="yaml">
path: /familias/:id
</route>
