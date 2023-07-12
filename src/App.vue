<script setup lang="ts">
import useAxiosInterceptors from '@/src/core/composables/useAxiosInterceptos'

useAxiosInterceptors()
</script>

<template>
  <ELayout>
    <RouterView />
  </ELayout>
</template>
