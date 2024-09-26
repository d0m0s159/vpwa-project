<template>
  <q-layout view="hHh lpR fFf" class="gradient-background">
    <q-page-container>
      <router-view />
    </q-page-container>
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
