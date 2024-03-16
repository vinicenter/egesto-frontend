<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['BillsList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
path: /contas
</route>
