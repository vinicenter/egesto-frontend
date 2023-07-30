<script lang="ts" setup>
import { useTheme } from 'vuetify'

const theme = useTheme();

const setTheme = (themeName: string) => {
  localStorage.setItem('theme', themeName)
  theme.global.name.value = themeName
}
</script>

<template>
  <section>
    Defina qual o tema desejas utilizar

    <div class="flex gap-sm">
      <VBtn @click="setTheme('light')">Claro</VBtn>
      <VBtn @click="setTheme('dark')">Escuro</VBtn>
    </div>
  </section>
</template>
