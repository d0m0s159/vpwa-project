<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>

        <q-toolbar-title>
          Slack
        </q-toolbar-title>

        <q-btn
          round
          color="white">

          <q-avatar size="28px">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>

          <q-menu style="width: 150px;">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-avatar icon="person"></q-avatar>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/auth/login">
                <q-avatar icon="directions" />
                <q-item-section>Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
</style>

<script>
export default {

}
</script>
