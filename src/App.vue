<script setup lang="ts">
import useAxiosInterceptors from '@/src/core/composables/useAxiosInterceptors'
import useNotify from '@/src/core/composables/useNotify'

const { notifyState } = useNotify()

const {
  isUnauthorized,
  logout
} = useAxiosInterceptors()

myUndefinedFunction();
</script>

<template>
  <ELayout>
    <RouterView />

    <VSnackbar
      v-model="notifyState.model"
      :color="notifyState.color"
      top
    >
      {{ notifyState.message }}

      <template v-slot:actions>
        <v-btn @click="notifyState.model = false">
          Fechar
        </v-btn>
      </template>
    </VSnackbar>

    <ELoginModel
      v-model="isUnauthorized"
      @logout="logout"
    />
  </ELayout>
</template>
