<script setup lang="ts">
import { getCostsTable } from '../../datasource/costsTable'
import useNotify from '@/src/core/composables/useNotify'
import { computed, ref, watch } from 'vue';
import { ICostsTable } from '../../types/costsTable'
import { useRouter } from 'vue-router';
import { numberFormat } from '@/src/core/utils/format';
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';

const router = useRouter()
const { displayMessage } = useNotify()
const { format } = numberFormat();

const props = defineProps<{
  id: string | null
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

type CostsTableType = ICostsTable.Root | undefined

const costsTableData = ref<CostsTableType>(undefined)
const loading = ref(false)
const tab = ref<'taxes' | 'shipping-families' | 'shipping-products'>('taxes')

watch(() => props.modelValue, async () => {
  if(!props.modelValue || !props.id) {
    return
  }

  try {
    tab.value = 'taxes'

    loading.value = true
    const data = await getCostsTable(props.id)

    costsTableData.value = data
  } catch (error) {
    displayMessage({ message: 'Erro ao carregar os dados da tabela de custo', type: 'error' })

    emit('update:modelValue', false)
  } finally {
    loading.value = false
  }
})

const tableColumn = [
  { label: 'Nome', style: 'width: 100px' },
  { label: 'Custo', style: 'width: 100px' }
]
</script>

<template>
  <EDialog width="900" v-model="model" title="Visualizar Tabela de Custo">
    <template #default>
      <CostTableDetailsSkeleton v-if="loading" />

      <template v-else>
        <div class="p-sm grid grid-cols-1 sm:grid-cols-2">
          <div>
            <div>Nome</div>
            {{ costsTableData?.name || '-' }}
          </div>

          <div>
            <div>Frete para registros não definidos</div>
            {{ `${format(costsTableData?.defaultShipmentCost)}%` }}
          </div>
        </div>

        <VTabs grow v-model="tab" class="overflow-visible">
          <VTab value="taxes">
            Impostos
          </VTab>
          <VTab value="shipping-families">
            Frete Familias
          </VTab>
          <VTab value="shipping-products">
            Frete Produtos
          </VTab>
        </VTabs>

        <div>
          <VWindow v-model="tab">
            <VWindowItem value="taxes">
              <ETable
                :loading="false"
                :hasNextPage="false"
                :columns="tableColumn"
                :data="costsTableData?.taxes || []"
                :nextPage="() => {}"
                noDataText="Nenhum imposto cadastrado"
              >
                <template #default="{ item }">
                  <td>{{ item?.name || '-' }}</td>
                  <td>{{ item?.cost ? `${item?.cost}%` : '-' }}</td>
                </template>
              </ETable>
            </VWindowItem>

            <VWindowItem value="shipping-families">
              <ETable
                :loading="false"
                :hasNextPage="false"
                :columns="tableColumn"
                :data="costsTableData?.shipments?.families || []"
                :nextPage="() => {}"
                noDataText="Nenhum frete de família cadastrado"
              >
                <template #default="{ item }">
                  <td>
                    <RouterLink
                      v-if="item?.family?.name"
                      :to="{ name: 'family', params: { id: item?.family?._id, type: 'edit' } }"
                    >
                      {{ formatFamilyLabel(item?.family) }}
                    </RouterLink>
                    
                    <div v-else>
                      -
                    </div>
                  </td>
                  <td>{{ item?.cost ? `${item?.cost}%` : '-' }}</td>
                </template>
              </ETable>
            </VWindowItem>

            <VWindowItem value="shipping-products">
              <ETable
                :loading="false"
                :hasNextPage="false"
                :columns="tableColumn"
                :data="costsTableData?.shipments?.products || []"
                :nextPage="() => {}"
                noDataText="Nenhum frete de produto cadastrado"
              >
                <template #default="{ item }">
                  <td>
                    <RouterLink
                      v-if="item?.product?.name"
                      :to="{ name: 'product', params: { id: item?.product?._id, type: 'editar' } }"
                    >
                      {{ item?.product?.name }}
                    </RouterLink>
                    
                    <div v-else>
                      -
                    </div>
                  </td>
                  <td>{{ item?.cost ? `${item?.cost}%` : '-' }}</td>
                </template>
              </ETable>
            </VWindowItem>
          </VWindow>
        </div>
      </template>
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
        @click="router.push({ name: 'cost-table', params: { id: costsTableData?._id, type: 'editar' } })"
      >
        Editar
      </VBtn>
    </template>
  </EDialog>
</template>
