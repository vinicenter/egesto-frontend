<script setup lang="ts">
interface Item {
  title: string
  childrens?: Item[]
  onClick?: Function
  divider?: boolean
  icon?: string
}

import { useRouter } from 'vue-router'
const router = useRouter()

const items: Item[] = [
  {
    title: 'Início',
    onClick: () => router.push({ name: 'home' }),
    icon: 'mdi-home',
  },
  {
    title: 'Cadastros',
    icon: 'mdi-receipt-text',
    childrens: [
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
    ]
  },
  {
    title: 'Conteúdos',
    icon: 'mdi-file-document',
    childrens: [
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
      {
        title: 'Entrada de pessoas',
        onClick: () => router.push({ name: 'people-join' }),
        icon: 'mdi-file-document',
      },
    ]
  },
  {
    title: 'Financeiro',
    icon: 'mdi-cash',
    childrens: [
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
    ]
  },
  {
    title: 'Usuários',
    icon: 'mdi-account-multiple',
    onClick: () => router.push({ name: 'users' }),
  },
  {
    title: 'Meu perfil',
    icon: 'mdi-account',
    onClick: () => router.push({ name: 'profile' }),
  }
]
</script>

<template>
  <VCard>
    <VLayout>
      <VNavigationDrawer width="300" rail expand-on-hover>
        <VList>
          <VListItem
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
          ></VListItem>
        </VList>

        <VDivider></VDivider>

        <VList density="compact" nav>
          <template v-for="(item) in items">
            <VListItem
              v-if="item.onClick"
              @click="item.onClick"
              :prepend-icon="item.icon"
              :title="item.title"
            />

            <VListGroup v-else>
              <template v-slot:activator="{ props }">
                <VListItem
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                ></VListItem>
              </template>

              <VListItem
                nav
                v-for="(children, index) in item.childrens"
                :key="`item-children-${index}`"
                :title="children.title"
                :prepend-icon="children.icon"
                @click="children.onClick"
              />
            </VListGroup>

          </template>
        </VList>
      </VNavigationDrawer>

      <VMain style="height: 100vh">
        <slot />
      </VMain>
    </VLayout>
  </VCard>
</template>
