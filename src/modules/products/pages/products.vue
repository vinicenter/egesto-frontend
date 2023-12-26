<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['ProductList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
path: /produtos
</route>
