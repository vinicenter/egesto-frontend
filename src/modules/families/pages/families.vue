<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['FamiliesList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
name: families
path: /familias
</route>
