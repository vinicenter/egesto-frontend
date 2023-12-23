<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
</script>

<template>
  <EInputText
    name="tenant"
    label="Empresa"
    :rules="[required]"
  />

  <EInputText
    name="username"
    label="Usuário"
    :rules="[required]"
  />

  <EInputText
    name="password"
    label="Senha"
    type="password"
    :rules="[required]"
  />
</template>
