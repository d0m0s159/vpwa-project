<template>
  <q-page class="column items-center justify-center">
    <h2>Create an account</h2>
    <q-card class="q-pa-lg">
      <q-separator />
      <q-form @submit.prevent="onSubmit" class="text-center q-mb-sm" ref="registerForm">
        <q-input
          name="email"
          id="email"
          v-model="form.email"
          outlined
          hint="E-mail"
          type="email"
          class="q-mb-sm"
          label="Email"
          autofocus
          :rules="[val => !!val || 'E-mail is required', val => /.+@.+\..+/.test(val) || 'E-mail must be valid']"
        />

        <q-input
          id="nickname"
          name="nickname"
          v-model="form.nickname"
          outlined
          hint="Nickname"
          type="text"
          class="q-mb-sm"
          :rules="[val => !!val || 'Nickname is required']"
        />

        <q-input
          id="firstname"
          name="firstname"
          v-model="form.firstname"
          outlined
          hint="First Name"
          type="text"
          class="q-mb-sm"
          :rules="[val => !!val || 'First Name is required']"
        />

        <q-input
          id="surname"
          name="surname"
          v-model="form.surname"
          outlined
          hint="Surname"
          type="text"
          class="q-mb-sm"
          :rules="[val => !!val || 'Surname is required']"
        />

        <q-input
          id="password"
          name="password"
          label="Password"
          v-model="form.password"
          outlined
          :type="showPassword ? 'text' : 'password'"
          hint="Password"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Password is required',
            val => val.length >= 8 || 'Password must be at least 8 characters long',
            val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
            val => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
            val => /[0-9]/.test(val) || 'Password must contain at least one number',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="togglePasswordVisibility"
            />
          </template>
        </q-input>

        <q-input
          id="password_confirmation"
          name="password_confirmation"
          label="Confirm Password"
          v-model="form.passwordConfirmation"
          outlined
          hint="Repeat password"
          type="password"
          class="q-mb-lg"
          :rules="[
            val => !!val || 'Repeat the password you typed in the previous field',
            val => val === form.password || 'Field must match the first password'
          ]"
        />

        <div class="row justify-center">
          <q-btn
            type="submit"
            rounded
            dense
            color="primary"
            size="lg"
            label="Register"
            class="q-mb-sm q-px-lg"
            no-caps
          />
        </div>
      </q-form>

      <q-separator />

      <q-card-section class="text-center">
        <div class="text-caption">
          Already have an account?
          <router-link to="/auth/login"> Log in here </router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/useAuthStore'
import { QForm } from 'quasar'

interface FormFields {
  email: string
  nickname: string
  firstname: string
  surname: string
  password: string
  passwordConfirmation: string
}

export default defineComponent({
  name: 'RegisterPage',
  setup () {
    const router = useRouter()
    const authStore = useAuthStore()

    // Reactive form data with explicit typing
    const form = reactive<FormFields>({
      email: '',
      nickname: '',
      firstname: '',
      surname: '',
      password: '',
      passwordConfirmation: ''
    })

    // Password visibility toggle
    const showPassword = ref(false)

    // Form reference with type for validation
    const registerForm = ref<QForm | null>(null)

    // Computed property for loading status
    const loading = computed(() => authStore.status === 'pending')

    // Redirect target after successful registration
    const redirectTo = computed(() => ({ name: 'login' }))

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    // Form submission handler
    const onSubmit = async () => {
      if (registerForm.value) {
        const isValid = await registerForm.value.validate()
        console.log(process.env.API_URL)
        if (isValid) {
          try {
            await authStore.register(form)
            router.push(redirectTo.value)
          } catch (error) {
            console.error('Registration failed:', error)
          }
        }
      }
    }

    return {
      form,
      showPassword,
      registerForm,
      loading,
      onSubmit,
      redirectTo,
      togglePasswordVisibility
    }
  }
})
</script>

<style scoped>
.q-card {
  width: 360px;
}

h2 {
  color: #ffffff;
}

@media (max-width: 600px) {
  h2 {
    font-size: 2.5rem;
  }
  .q-card {
    width: 80vw;
  }
}
</style>
