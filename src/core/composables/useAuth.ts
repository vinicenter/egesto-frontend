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

const authStorage = computed({
  get: () => {
    return authLocalStorage.value ? JSON.parse(authLocalStorage.value) : undefined
  },
  set: (auth: IAuth | undefined) => {
    if(!auth) {
      authLocalStorage.value = undefined;
      return;
    }

    Sentry.setTag("tenant", tenantStorage.value);
    Sentry.setUser({ email: auth.email, username: auth.username });

    authLocalStorage.value = JSON.stringify(auth);
  },
})

export default () => {
  return {
    tenantStorage,
    authStorage,
  }
}
