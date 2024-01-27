<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['CostTableList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
path: /tabelas-de-custos
</route>
