<script setup lang="ts">
interface Item {
  title: string
  childrens?: Item[]
  onClick?: Function
  divider?: boolean
  icon?: string
}

import { ref } from 'vue'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { removeToken } from '~utils/auth'
import { removeTenant } from '~utils/tenant'
const router = useRouter()
const route = useRoute()

const enableNavbar = computed(() => !route.meta['disable-navbar'])

const items: Item[][] = [
  [
    {
      title: 'Início',
      onClick: () => router.push({ name: 'home' }),
      icon: 'mdi-home',
    },
  ],
  [
    {
      title: 'Pessoas',
      onClick: () => router.push({ name: 'list-people' }),
      divider: true,
      icon: 'mdi-account-multiple',
    },
    {
      title: 'Matérias Primas',
      onClick: () => router.push({ name: 'list-feedstocks' }),
      icon: 'mdi-package-down',
    },
    {
      title: 'Produtos',
      onClick: () => router.push({ name: 'list-products' }),
      divider: true,
      icon: 'mdi-package-variant-closed',
    },
    {
      title: 'Marcas',
      onClick: () => router.push({ name: 'list-brands' }),
      icon: 'mdi-tag-text-outline',
    },
    {
      title: 'Famílias',
      onClick: () => router.push({ name: 'list-families' }),
      divider: true,
      icon: 'mdi-tag',
    },
  ],
  [
    {
      title: 'Tabelas de Custos',
      onClick: () => router.push({ name: 'list-costs-table' }),
      icon: 'mdi-cash',
    },
    {
      title: 'Tabelas de Preços',
      onClick: () => router.push({ name: 'list-prices-table' }),
      icon: 'mdi-cash',
    },
  ],
  [
    {
      title: 'Configurações',
      icon: 'mdi-cog-outline',
      onClick: () => router.push({ name: 'settings' }),
    },
    {
      title: 'Usuários',
      icon: 'mdi-account-multiple',
      onClick: () => router.push({ name: 'list-users' }),
    },
    {
      title: 'Sair',
      icon: 'mdi-logout',
      onClick: () => {
        removeToken()
        removeTenant()
        router.push({ name: 'login-user' })
      },
    },
  ],
]

const drawer = ref(false)
</script>

<template>
  <VLayout>
    <VAppBar v-if="enableNavbar">
      <VAppBarNavIcon @click="drawer = !drawer" />
      <VAppBarTitle>eGesto</VAppBarTitle>
    </VAppBar>
    
    <VNavigationDrawer v-model="drawer" location="left" width="250" v-if="enableNavbar">
      <VList density="compact" nav>
        <template v-for="(buttons) in items">
          <template v-for="button in buttons">
            <VListItem
              :title="button.title"
              @click="button.onClick"
              :prepend-icon="button.icon"
            />
          </template>

          <VDivider />
        </template>
      </VList>
    </VNavigationDrawer>

    <VMain>
      <VContainer>
        <h1>{{ route.meta.title }}</h1>

        <slot />
      </VContainer>
    </VMain>
  </VLayout>
</template>
