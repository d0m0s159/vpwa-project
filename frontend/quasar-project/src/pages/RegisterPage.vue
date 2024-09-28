<template>
  <q-page class="column items-center justify-center">
    <h2>Create an account</h2>
    <q-card class="q-pa-lg">
      <q-separator />
      <q-form @submit="onSubmit" class="text-center q-mb-sm">
        <q-input
          v-model="email"
          outlined
          hint="E-mail"
          type="email"
          class="q-mb-sm"
          :rules="[val => !!val || 'E-mail is required', val => /.+@.+\..+/.test(val) || 'E-mail must be valid']"
        />

        <q-input
          v-model="nickname"
          outlined
          hint="Nickname"
          type="text"
          class="q-mb-sm"
          :rules="[val => !!val || 'Nickname is required']"
        />

        <q-input
          v-model="firstname"
          outlined
          hint="First Name"
          type="text"
          class="q-mb-sm"
          :rules="[val => !!val || 'First Name is required']"
        />

        <q-input
          v-model="surname"
          outlined
          hint="Surname"
          type="text"
          class="q-mb-sm"
          :rules="[val => !!val || 'Surname is required']"
        />

        <q-input
          v-model="password"
          outlined
          :type="isPwd ? 'password' : 'text'"
          hint="Password"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Password is required',
            val => val.length >= 8 || 'Password must be at least 8 characters long',
            val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
            val => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
            val => /[0-9]/.test(val) || 'Password must contain at least one number',
            val => /[!@#$%^&*]/.test(val) || 'Password must contain at least one special character'
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          v-model="passwordRepeat"
          outlined
          hint="Repeat password"
          type="password"
          class="q-mb-lg"
          :rules="[
            val => !!val || 'Repeat the password you typed in the previous field',
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
            to="/auth/login"
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

<script>

export default {
  data() {
    return {
      email: '',
      nickname: '',
      firstname: '',
      surname: '',
      password: '',
      passwordRepeat: '',
      isPwd: true,
    };
  },
  methods: {
    onSubmit() {
      // Handle form submission
      console.log('Form submitted');
    }
  }
};
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
