<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['BrandsList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
path: /marcas
</route>
