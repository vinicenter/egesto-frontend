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
name: bills
path: /contas
</route>
