<script setup lang="ts">
import { RuleExpression, useField } from 'vee-validate';
import {  } from 'vuetify'
import { MaybeRef, toRef } from 'vue';
import { VTextField } from 'vuetify/lib/components/index.mjs';

const props = defineProps<{
  name: string
  rules?: MaybeRef<RuleExpression<unknown>>
  searchable?: boolean
  showCreate?: boolean
}>()

const search = defineModel<string>('search')

const emit = defineEmits<{
  (e: 'create'): void
}>()

const { value, errorMessage, handleBlur } = useField<unknown>(toRef(props, "name"), props.rules)
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
        <div class="bg-white fixed w-full z-100 flex justify-center items-center gap-4px p-x-xs">
          <VTextField
            hide-details
            label="Pesquisar"
            v-model="search"
            clearable
            @click:clear="search = ''"
          />

          <VBtn
            v-if="showCreate"
            color="primary"
            icon="mdi-plus"
            variant="flat"
            @click="emit('create')"
          />
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
