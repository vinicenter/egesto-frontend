<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['UserList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
name: users
path: /usuarios
</route>
