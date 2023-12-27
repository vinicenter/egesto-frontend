<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import {  } from 'vuetify'
import { MaybeRef } from 'vue';

const props = defineProps<{
  name: string
  rules?: MaybeRef<RuleExpression<unknown>>
  searchable?: boolean
}>()

const search = defineModel<string>('search')

const { value, errorMessage, handleBlur } = useField<unknown>(props.name, props.rules)
</script>

<template>
  <VSelect
    v-model="value"
    :return-object="false"
    clearable
    :error-messages="errorMessage"
    @blur="handleBlur"
  >
    <template #no-data>
      <div class="flex justify-center my-sm">Nenhum dado encontrado</div>
    </template>

    <template
      v-if="searchable"
      #prepend-item
    >
      <div class="h-60px w-full">
        <div class="bg-white h-60px fixed w-full z-100">
          <VTextField hide-details label="Pesquisar" v-model="search" clearable />
        </div>
      </div>

      <slot name="prepend-search" />
    </template>

    <template
      v-for="(_, name) in ($slots as {})"
      #[name]="slotProps = {}"
    >
      <slot
        v-bind="slotProps"
        :name="name"
      />
    </template>
  </VSelect>
</template>
