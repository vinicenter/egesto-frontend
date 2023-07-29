<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { createPerson, deletePerson, getPerson, updatePerson } from '../../datasource/people';
import { IPeople } from '../../types/people'
import { reactive } from 'vue';

defineProps<{ id: string }>()

const router = useRouter();

const model = reactive({
  name: '',
  document: '',
  stateRegistration: '',
  corporateName: '',
  fantasyName: '',
  phone: '',
  email: '',
  observation: '',
  address: {}
})

const loadModel = (data: IPeople) => {
  model.address = {
    zipCode: data.address?.zipCode,
    street: data.address?.street,
    number: data.address?.number,
    complement: data.address?.complement,
    neighborhood: data.address?.neighborhood,
    federativeUnit: data.address?.federativeUnit,
    city: data.address?.city,
  }
  model.document = data.document
  model.email = data.email || ''
  model.phone = data.phone || ''
  model.corporateName = data.corporateName
  model.fantasyName = data.fantasyName
  model.stateRegistration = data.stateRegistration || ''
  model.observation = data.observation || ''
}
</script>

<template>
  <EGenericIdView
    :id="id"
    :format-submit-fn="(data: IPeople) => ({ ...data })"
    :create-fn="createPerson"
    :delete-fn="deletePerson"
    :get-fn="getPerson"
    :update-fn="updatePerson"
    :model="model"
    @load="loadModel"
    @finish="router.push({  name: 'list-people' })"
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
path: /pessoas/:id
</route>
