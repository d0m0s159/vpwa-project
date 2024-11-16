<template>
  <q-page class="column items-center justify-center">
    <h2 class>Log into your account</h2>
    <q-card class="q-pa-lg">
      <q-form class="text-center q-mb-sm" @submit="onSubmit" ref="loginForm">
        <q-input
          name="email"
          id="email"
          v-model.trim="credentials.email"
          type="email"
          label="Email"
          :rules="[val => !!val || 'Email required']"
          autofocus
        />
        <q-input
          id="password"
          name="password"
          v-model="credentials.password"
          label="Password"
          :type="isPwd ? 'text' : 'password'"
          :rules="[val => !!val || 'Password required']"
          bottom-slots
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

          <q-btn
            type="submit"
            rounded
            dense
            color="primary"
            size="lg"
            label="Login"
            class="q-mb-sm q-px-lg"
            no-caps
          />
      </q-form>

      <q-separator />

      <q-card-section class="text-center">
        <div class="text-caption">
          Don't have an account?
          <router-link to="/auth/register">
            Register now
          </router-link>
        </div>
      </q-card-section>

    </q-card>
  </q-page>
  </template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/useAuthStore'

export default defineComponent({
  name: 'LoginPage',
  setup () {
    const authStore = useAuthStore()

    const credentials = ref({
      email: '',
      password: ''
    })

    const router = useRouter()
    const isPwd = ref(false)

    const loading = ref(false)

    const onSubmit = async () => {
      loading.value = true
      console.log(process.env.API_URL)
      try {
        await authStore.login(credentials.value)
        const redirectTo = { name: 'home' }
        router.push(redirectTo)
      } catch (error) {
        console.error('Login failed', error)
      } finally {
        loading.value = false
      }
    }

    return {
      credentials,
      isPwd,
      loading,
      onSubmit
    }
  }
})
</script>

<style>
.q-card {
  width: 360px;
}

h2 {
  color: #ffffff
}

@media (max-width: 600px) {
  h2 {
    font-size: 2.25rem;
  }
  .q-card {
      width: 80vw;
  }
}
</style>
