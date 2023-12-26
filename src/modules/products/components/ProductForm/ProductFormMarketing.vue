<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';

defineProps<{
  disabled: boolean;
}>();
</script>

<template>
  <section class="space-y-4">
  <div class="font-bold">Marketing</div>

  <div class="flex">
    <ESelect
      name="marketing.isPublic"
      :disabled="disabled"
      :items="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
      :return-object="false"
      :clearable="false"
      hint="Se o produto for público, ele será exibido no site."
      persistent-hint
      item-title="label"
      label="Produto público"
      :rules="[required]"
    />

    <EColorPicker
      name="marketing.color"
      title="asdas"
      :disabled="disabled"
      :modes="['hex']"
    />
  </div>

  <ETextarea
    name="marketing.description"
    label="Descrição"
    hint="Esta descrição será exibida no site, caso o produto seja público."
    persistent-hint
    :disabled="disabled"
  />
</section>
</template>