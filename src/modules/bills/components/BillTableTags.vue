<script setup lang="ts">
import { IBillTagRoot } from '../types/bill-tags';

defineProps<{
  tags: IBillTagRoot[]
}>()
</script>

<template>
  <div class="flex gap-2 my-2">
    <VChip
      v-for="tag, index in tags.slice(0, 3)"
      :key="`tag-${index}`"
      :color="tag.color"
      variant="flat"
      size="small"
    >
      {{ tag.name }}
    </VChip>

    <VMenu>
      <template #activator="{ props }">
        <VChip
          v-if="tags.length > 3"
          color="gray"
          variant="flat"
          size="small"
          v-bind="props"
        >
          +{{ tags.length - 3 }}
        </VChip>
      </template>

      <VList>
        <VListItem
          v-for="tag, index in tags.slice(3)"
          :key="`tag-${index}`"
        >
          <VChip
            :color="tag.color"
            variant="flat"
            size="small"
          >
            {{ tag.name }}
          </VChip>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>
