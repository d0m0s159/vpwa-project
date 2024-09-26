<template>
  <q-page class="column items-center justify-center">
    <h2>Create an account</h2>
    <q-card class="q-pa-lg">
      <q-separator />
      <q-form class="text-center q-mb-sm">
        <q-input
          v-model="email"
          outlined
          hint="E-mail"
          type="email"
          class="q-mb-sm"
        />

        <q-input
          v-model="nickname"
          outlined
          hint="Nickname"
          type="text"
          class="q-mb-sm"
        />

        <q-input
          v-model="firstname"
          outlined
          hint="First Name"
          type="text"
          class="q-mb-sm"
        />

        <q-input
          v-model="surname"
          outlined
          hint="Surname"
          type="text"
          class="q-mb-sm"
        />

        <q-input
          v-model="password"
          outlined
          :type="isPwd ? 'password' : 'text'"
          hint="Password"
          class="q-mb-sm"
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
        <div class="text-caption">Already have an account? Log in here</div>
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
};
</script>

<style scoped>
.q-card {
  width: 360px;
}

h2 {
    color: #ffffff
  }

@media (max-width: 600px) {
  h2 {
    font-size: 2.5rem;
  }
}
</style>
