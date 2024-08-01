<script setup lang="ts">
import useAuth from '@/src/core/composables/useAuth'
import { useRouter } from 'vue-router';
import { apiHealthCheck } from '@/src/modules/home/datasource/home';
import { useQuery } from '@tanstack/vue-query';

const router = useRouter()

const {
  authStorage
} = useAuth()

useQuery({
  queryKey: [ 'api-health-check' ],
  queryFn: apiHealthCheck,
})
</script>

<template>
  <div class="space-y-4">
    <div>
      Bem vindo, {{ authStorage?.name || 'usuário' }}.
    </div>

    <EImageUpload name="photo" />

    <VContainer class="space-y-4">
      <h1 class="text-lg">Cadastros</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <VCard
          link
          prepend-icon="mdi-account-multiple" 
          title="Pessoas"
          subtitle="Gerencie os clientes e fornecedores"
          @click="router.push({ name: 'list-people' })"
        />

        <VCard
          link
          prepend-icon="mdi-package-down" 
          title="Matérias Primas"
          subtitle="Gerencie as matérias primas"
          @click="router.push({ name: 'list-feedstocks' })"
        />

        <VCard
          link
          prepend-icon="mdi-package-variant-closed"
          title="Produtos"
          subtitle="Gerencie produtos e formulações"
          @click="router.push({ name: 'list-products' })"
        />

        <VCard
          link
          prepend-icon="mdi-tag-text-outline"
          title="Marcas"
          subtitle="Gerencie marcas de produtos"
          @click="router.push({ name: 'list-brands' })"
        />

        <VCard
          link
          prepend-icon="mdi-tag"
          title="Famílias"
          subtitle="Gerencie famílias de produtos"
          @click="router.push({ name: 'list-families' })"
        />
      </div>
    </VContainer>

    <VDivider />

    <VContainer class="space-y-4">
      <h1 class="text-lg">Financeiro</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <VCard
          link
          prepend-icon="mdi-cash" 
          title="Tabelas de Custos"
          subtitle="Gerencie as tabelas de custos"
          @click="router.push({ name: 'list-costs-table' })"
        />

        <VCard
          link
          prepend-icon="mdi-cash-lock" 
          title="Tabelas de Preços"
          subtitle="Gerencie as tabelas de preços"
          @click="router.push({ name: 'list-prices-table' })"
        />

        <VCard
          link
          prepend-icon="mdi-currency-usd" 
          title="Contas"
          subtitle="Gerencie as contas da sua empresa"
          @click="router.push({ name: 'list-bills' })"
        />
      </div>
    </VContainer>

    <VDivider />

    <VContainer class="space-y-4">
      <h1 class="text-lg">Geral</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <VCard
          link
          prepend-icon="mdi-cog-outline" 
          title="Configurações"
          subtitle="Configurações do sistema"
          @click="router.push({ name: 'settings' })"
        />

        <VCard
          link
          prepend-icon="mdi-account-multiple" 
          title="Usuários"
          subtitle="Gerencie os usuários do sistema"
          @click="router.push({ name: 'list-users' })"
        />
      </div>
    </VContainer>
  </div>
</template>

<route lang="yaml">
name: home
path: /
meta:
  title: Início
</route>
