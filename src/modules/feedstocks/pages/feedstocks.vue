<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['FeedstocksList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
name: feedstocks
path: /materias-primas
</route>
