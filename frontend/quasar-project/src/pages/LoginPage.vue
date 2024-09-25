<template>
  <q-page class="row items-center justify-center">
    <q-card class="q-pa-lg">
      <q-card-section class="bg-primary text-white text-center">
        <div class="text-h4">LOGIN</div>
      </q-card-section>
      <q-separator />
      <q-form class="text-center q-mb-sm">
        <q-input 
        class="q-my-md" 
        outlined 
        v-model="name"
        type="text" 
        name="nickname"  />
        <q-input
          class="q-my-md"
          v-model="password"
          outlined
          :type="isPwd ? 'password' : 'text'"
          hint="Password with toggle"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn color="primary" type="submit" label="login"></q-btn>
      </q-form>

      <q-separator />

      <q-card-section class="text-center">
        <div class="text-caption">Don't have an account? Register now</div>
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
    }
  }
  </script>
  
  <style>
  .q-card {
    width: 360px;
  }
  </style>