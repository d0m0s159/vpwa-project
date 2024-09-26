<template>
  <q-layout view="hHh lpR fFf" class="gradient-background">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<style scoped>
.gradient-background {
  background: linear-gradient(
    to right,
    #cc2936,
    #aa15b8
  ); /* Example gradient */
  min-height: 100vh; /* Ensure it covers the full height */
}
</style>
