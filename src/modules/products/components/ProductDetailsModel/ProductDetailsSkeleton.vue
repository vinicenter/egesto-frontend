<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div>
    <VSkeletonLoader type="list-item" />
    <VSkeletonLoader type="list-item" />
    <VSkeletonLoader type="list-item" />
    <VSkeletonLoader type="list-item" />
    <VSkeletonLoader type="list-item" />
  </div>

  <div class="flex flex-row">
    <VSkeletonLoader class="w-full" type="list-item" />
    <VSkeletonLoader class="w-full" type="list-item" />
  </div>
</template>
