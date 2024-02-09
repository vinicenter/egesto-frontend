import { IAuth } from "@/src/modules/users/types/auth";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";
import * as Sentry from "@sentry/vue";

const tenantStorage = useLocalStorage<string | undefined>('tenant', undefined, {
  listenToStorageChanges: true,
});

const authLocalStorage = useLocalStorage<string | undefined>('auth', undefined, {
  listenToStorageChanges: true,
});

const setUserToSentry = () => {
  if(!import.meta.env.PROD) {
    return
  }

  if (tenantStorage.value) {
    Sentry.setTag("tenant", tenantStorage.value);
  }

  if (authStorage.value) {
    Sentry.setUser({ email: authStorage.value?.email, username: authStorage.value?.email });
  }
}

const authStorage = computed({
  get: () => {
    return authLocalStorage.value ? JSON.parse(authLocalStorage.value) : undefined
  },
  set: (auth: IAuth | undefined) => {
    if(!auth) {
      authLocalStorage.value = undefined;
      return;
    }

    setUserToSentry()

    authLocalStorage.value = JSON.stringify(auth);
  },
})

export default () => {
  setUserToSentry()

  return {
    tenantStorage,
    authStorage,
  }
}
