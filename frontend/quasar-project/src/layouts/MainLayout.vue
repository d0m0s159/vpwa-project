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
          <q-menu
          anchor="bottom right"
          self="top right">
          <q-list style="min-width: 120px">
            <q-item clickable v-close-popup>
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section side>
                <q-avatar
                icon="directions"/>
              </q-item-section>
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
  setup () {
  }
}
</script>