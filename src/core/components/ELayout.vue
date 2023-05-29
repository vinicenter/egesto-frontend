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
      onClick: () => router.push({ name: 'people' }),
      divider: true,
      icon: 'mdi-account-multiple',
    },
    {
      title: 'Produtos',
      onClick: () => router.push({ name: 'products' }),
      icon: 'mdi-package-down',
    },
    {
      title: 'Produtos acabados',
      onClick: () => router.push({ name: 'final-products' }),
      divider: true,
      icon: 'mdi-package-variant-closed',
    },
    {
      title: 'Marcas',
      onClick: () => router.push({ name: 'brands' }),
      icon: 'mdi-tag-text-outline',
    },
    {
      title: 'Famílias',
      onClick: () => router.push({ name: 'families' }),
      divider: true,
      icon: 'mdi-tag',
    },
    {
      title: 'Categorias',
      onClick: () => router.push({ name: 'categories' }),
      icon: 'mdi-tag-multiple-outline',
    },
  ],
  [
    {
      title: 'Blog',
      onClick: () => router.push({ name: 'blog' }),
      divider: true,
      icon: 'mdi-file-document',
    },
    {
      title: 'Notícias',
      onClick: () => router.push({ name: 'news' }),
      icon: 'mdi-file-document',
    },
    {
      title: 'Receitas',
      onClick: () => router.push({ name: 'recipes' }),
      divider: true,
      icon: 'mdi-file-document',
    },
    {
      title: 'SEO',
      onClick: () => router.push({ name: 'seo' }),
      divider: true,
      icon: 'mdi-file-document',
    },
  ],
  [
    {
      title: 'Custos',
      onClick: () => router.push({ name: 'costs' }),
      icon: 'mdi-cash',
    },
    {
      title: 'Preços de vendas',
      onClick: () => router.push({ name: 'selling-prices' }),
      icon: 'mdi-cash',
    },
  ],
  [
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
  <VCard>
    <VLayout>
      <VAppBar v-if="enableNavbar">
        <VAppBarTitle>eGesto</VAppBarTitle>
        <VAppBarNavIcon @click="drawer = !drawer" />
      </VAppBar>
      
      <VNavigationDrawer v-model="drawer" location="right" width="250" v-if="enableNavbar">
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

          <div>
            <slot />
          </div>
        </VContainer>
      </VMain>
    </VLayout>
  </VCard>
</template>
