<template>
  <q-page class="row items-center justify-center">
    <q-card class="q-pa-lg">
      <q-card-section class="q-mb-sm bg-primary text-white text-center">
        <div class="text-h5">CREATE AN ACCOUNT</div>
      </q-card-section>
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
          <q-btn type='submit' rounded dense color="primary" size="lg" label="Register" />
        </div>

      </q-form>
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

<style scoped></style>
