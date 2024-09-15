<script setup lang="ts">
import { emailValidation, required } from '@/src/core/utils/form-validator';

defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <section>
    <div class="font-bold">Informações básicas</div>

    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-sm">
        <EInputText
          name="stateRegistration"
          :disabled="disabled"
          label="Inscrição Estadual"
        />

        <EInputText
          name="phone"
          :disabled="disabled"
          label="Celular"
        />

        <EInputText
          name="email"
          :disabled="disabled"
          label="E-mail"
          :rules="[emailValidation]"
        />

        <EInputText
          name="address.zipCode"
          :disabled="disabled"
          label="CEP"
        />

        <ESelectStates
          name="address.federativeUnit"
          :disabled="disabled"
          label="UF"
          :rules="[required]"
        />

        <EInputText
          name="address.city"
          :disabled="disabled"
          label="Cidade"
        />

        <EInputText
          name="address.neighborhood"
          :disabled="disabled"
          label="Bairro"
        />

        <EInputText
          name="address.street"
          :disabled="disabled"
          label="Rua"
        />

        <EInputText
          name="address.number"
          :disabled="disabled"
          label="Número"
        />
      </div>

      <ETextarea
        name="observation"
        :disabled="disabled"
        label="Observação"
      />
    </div>
  </section>
</template>
