<script lang="ts" setup>
import { useAttrs } from 'vue';
import { getBillTags } from '../../datasource/bill-types';
import { VListItemMedia } from 'vuetify/lib/components/index.mjs';
import { reactive } from 'vue';
import { IBillTagRoot } from '../../types/bill-tags';
import BillTagsEditModal from './BillTagsEditModal.vue';
import { useFieldArray } from 'vee-validate';
import BillTagsRemoveModal from './BillTagsRemoveModal.vue';

const props = defineProps<{
  name: string,
  editable?: boolean,
}>()

const editModalState = reactive({
  modelValue: false,
  billTagData: undefined,
})

const openEditModal = (billTagData?: IBillTagRoot) => {
  Object.assign(editModalState, {
    modelValue: true,
    billTagData,
  })
}

const removeModalState = reactive({
  modelValue: false,
  billTagData: undefined,
})

const openRemoveModal = (billTagData: IBillTagRoot) => {
  Object.assign(removeModalState, {
    modelValue: true,
    billTagData,
  })
}

const {
  push: pushTag,
  replace: replaceTags,
  remove: removeTagByIndex,
  fields,
} = useFieldArray<IBillTagRoot>(props.name)

const updateTag = (tag: IBillTagRoot) => {
  const index = fields.value.findIndex((field) => field.value._id === tag._id)

  if(index === -1) return

  const newFields = [ ...fields.value ]

  newFields[index].value = tag

  replaceTags(newFields.map((field) => field.value))
}

const removeTagByEntity = (tag: IBillTagRoot) => {
  const newFields = fields.value.filter((field) => field.value._id !== tag._id)

  replaceTags(newFields.map((field) => field.value))
}

const attrs = useAttrs()
</script>

<template>
  <div>
    <ESelectQuery
      v-bind="attrs"
      :name="name"
      label="Tags"
      :show-create="editable"
      query-key="bills-tag"
      multiple
      chips
      :query-fn="getBillTags"
      @create="openEditModal"
    >
      <template #chip="{ item, index }">
        <VChip
          variant="flat"
          closable
          @click:close="removeTagByIndex(index)"
          :color="item.raw.color"
          @mousedown.prevent.stop
        >
          {{ item.raw.name }}
        </VChip>
      </template>

      <template #item="scope">
        <VListItem v-bind="scope.props" title="">
          <VListItemMedia class="flex justify-between">
            <div class="flex items-center">
              <VChip
                :color="scope.item.raw.color"
                class="mr-2"
                variant="flat"
              >
                {{ scope.item.raw.name }}
              </VChip>
            </div>

            <div v-if="editable">
              <VBtn
                @click.prevent.stop="openEditModal(scope.item.raw)"
                icon="mdi-pencil"
                color="primary"
                size="x-small"
                title="Editar"
                variant="flat"
                class="ml-2"
              />
    
              <VBtn
                @click.prevent.stop="openRemoveModal(scope.item.raw)"
                icon="mdi-delete"
                color="red"
                size="x-small"
                title="Remover"
                variant="flat"
                class="ml-2"
              />
            </div>
          </VListItemMedia>
        </VListItem>
      </template>
    </ESelectQuery>

    <BillTagsEditModal
      v-model="editModalState.modelValue"
      :bill-tag-data="editModalState.billTagData"
      @new-tag="pushTag($event)"
      @edit-tag="updateTag"
    />

    <BillTagsRemoveModal
      v-model="removeModalState.modelValue"
      :bill-tag-data="removeModalState.billTagData"
      @remove-tag="removeTagByEntity"
    />
  </div>
</template>
