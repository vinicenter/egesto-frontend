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
path: /tabelas-de-precos
</route>
