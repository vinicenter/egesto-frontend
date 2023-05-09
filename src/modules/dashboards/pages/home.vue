<script setup lang=ts>
import { createUser } from '@/src/modules/users/datasource/auth.ts'

const onCreate = () => {
  createUser('teste', 'teste', 'teste', 'teste@teste.com')
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <VIcon class="text-black" icon="mdi-home" />
    <VBtn @click="onCreate">Create a new user to test</VBtn>
  </div>
</template>

<route lang="yaml">
name: home
path: /
</route>
