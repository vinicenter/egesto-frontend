<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['PriceTableList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
name: prices-table
path: /tabelas-de-precos
</route>
