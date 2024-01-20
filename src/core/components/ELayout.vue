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
import useAuth from '../composables/useAuth';
import useAxiosInterceptors from '../composables/useAxiosInterceptors';
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
  ],
]

const {
  authStorage,
  tenantStorage,
} = useAuth()

const { logout } = useAxiosInterceptors()

const drawer = ref(true)

if(!authStorage.value) {
  logout()
}

const userInitials = computed(() => {
  if(!authStorage.value) {
    return ''
  }

  const names = authStorage.value.name.split(' ')

  if(names.length === 1) {
    return names[0].charAt(0)
  }

  const initials = [
    names[0].charAt(0),
    names[names.length - 1].charAt(0),
  ].join('')

  return initials
})
</script>

<template>
  <VLayout class="h-100vh">
    <VAppBar v-if="enableNavbar">
      <VAppBarNavIcon @click="drawer = !drawer" />
      <VAppBarTitle>eGesto</VAppBarTitle>
    </VAppBar>

    <VNavigationDrawer v-model="drawer" location="left" width="250" v-if="enableNavbar">
      <div class="h-100px flex items-center">
        <VListItem
          v-if="authStorage && tenantStorage"
          :title="authStorage.name"
        >
          <template #prepend>
            <VAvatar
              color="brown"
              size="large"
            >
              <span class="text-h6">{{ userInitials }}</span>
            </VAvatar>
          </template>
  
          <VListItemSubtitle>
            <div>
              <VIcon>mdi-account</VIcon>
              {{ authStorage.username }}
            </div>
            <div>
              <VIcon>mdi-domain</VIcon>
              {{ tenantStorage }}
            </div>
          </VListItemSubtitle>
        </VListItem>
      </div>

      <VDivider />

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

      <template v-slot:append>
        <div class="pa-2">
          <VBtn
            block
            prepend-icon="mdi-logout"
            @click="logout()"
          >
            Sair
          </VBtn>
        </div>
      </template>
    </VNavigationDrawer>

    <VMain>
      <VContainer class="mb-2">
        <h1>{{ route.meta.title }}</h1>

        <slot />
      </VContainer>
    </VMain>
  </VLayout>
</template>
