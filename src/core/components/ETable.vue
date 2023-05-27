<script lang="ts" setup>
type AvoidValidation<T> = T

defineProps<{
  columns: { label: string, style: string }[];
  data: AvoidValidation<{ [key: string]: any; }[] | undefined>;
  hasNextPage: AvoidValidation<boolean | undefined>;
  loading: boolean;
  nextPage: Function;
}>();
</script>

<template>
  <div>
    <VTable
      hover
      v-if="loading || data?.length"
    >
      <thead>
        <tr>
          <th :style="column.style" v-for="(column, index) in columns" :key="`e-table-col-${index}`">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item) in data" :key="item">
          <tr>
            <slot :item="item" />
          </tr>
        </template>
      </tbody>
    </VTable>

    <div class="flex flex-col items-center" v-else>
      Nenhum dado encontrado, tente modificar a pesquisa ou adicionar um novo registro.
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