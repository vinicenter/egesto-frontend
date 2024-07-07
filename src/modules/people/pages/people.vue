<template>
  <RouterView>
    <template #default="{ Component }">
      <KeepAlive :max="1" :include="['PeopleList']">
        <component :is="Component" />
      </KeepAlive>
    </template>
  </RouterView>
</template>

<route lang="yaml">
name: people
path: /pessoas
</route>
