<script lang="ts" setup>
withDefaults(defineProps<{
  columns: { label: string, style?: string, tooltip?: string }[];
  data?: any[];
  hasNextPage?: boolean;
  loading: boolean;
  noDataText?: string;
  nextPage: Function;
}>(), {
  noDataText: 'Nenhum dado encontrado, tente modificar a pesquisa ou adicionar um novo registro.',
});
</script>

<template>
  <div>
    <VTable
      v-if="loading || data?.length"
      hover
    >
      <thead>
        <tr>
          <th :style="column.style" v-for="(column, index) in columns" :key="`e-table-col-${index}`">
            {{ column.label }}
            <VTooltip
              v-if="column.tooltip"
              :text="column.tooltip"
              location="top"
              open-on-click
            >
              <template v-slot:activator="{ props }">
                <VIcon size="12" v-bind="props" icon="mdi-information-outline" />
              </template>
            </VTooltip>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <template v-for="(item) in data" :key="item">
          <tr>
            <slot :item="item" />
          </tr>
        </template>
      </tbody>
    </VTable>

    <div class="flex flex-col items-center" v-else>
      {{ noDataText }}
    </div>

    <div class="flex flex-col items-center">
      <VProgressLinear
        v-if="loading"
        class="w-full"
        indeterminate
      />

      <VBtn
        v-if="hasNextPage"
        :loading="loading"
        @click="nextPage"
        class="mt-4"
      >
        Carregar mais
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
.tbody {
  tr {
    td {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
    }
  }
}
</style>
