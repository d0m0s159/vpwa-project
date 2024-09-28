<template>
  <q-page class="column items-center justify-center">
    <h2 class>Log into your account</h2>
    <q-card class="q-pa-lg">
      <q-form class="text-center q-mb-sm" @submit="onSubmit" ref="loginForm">
        <q-input
        class="q-my-md"
        outlined
        v-model="name"
        type="text"
        name="nickname"
        hint="Nickname"
        :rules="[val => !!val || 'Nickname required']"
        />
        <q-input
          class="q-my-md"
          v-model="password"
          outlined
          :type="isPwd ? 'password' : 'text'"
          hint="Password"
          :rules="[val => !!val || 'Password required']"
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
            type="button"
            rounded
            dense
            color="primary"
            size="lg"
            label="Login"
            class="q-mb-sm q-px-lg"
            no-caps
            @click="validate"
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

  <script>

  export default {
    name: 'LoginPage',
    data () {
      return {
        name: '',
        password: '',
        isPwd: true
      }
    },
    methods: {
      validate () {
        this.$refs.loginForm.validate().then((isValid) => {
          if(isValid){
            this.$router.push('/');
          }
        })
      }
    }
  }
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
