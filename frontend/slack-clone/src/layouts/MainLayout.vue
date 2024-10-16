<template>
  <q-layout view="hHh LpR fFf">
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
            class="menu"
            :offset="[10,4]">
            <q-list >
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

    <q-drawer
        :width="68"
        class="bg-primary right-drawer"
        v-model="leftDrawerOpen"
        side="left">
        <q-scroll-area class="fit"
        :horizontal-thumb-style="horizontalThumbStyle"
        :vertical-thumb-style="verticalThumbStyle">
          <q-list>
            <q-item clickable class="q-pl-sm" v-for="n in 20" :key="n" style="width: 50">
              <q-avatar clickable size="52px" class="channel-icon" text-color="black">
                oh no
              </q-avatar>
            </q-item>
          </q-list>
        </q-scroll-area>
    </q-drawer>

    <div>
       <div class="q-pa-md q-mt-xl row justify-center">
    <div style="width: 100%; max-width: 700px">
      <MessageComponent
      v-for="(message, index) in [...messages].reverse()"
      :key="index" 
      :name="message.name" 
      :avatar="message.avatar" 
      :text="message.text" 
      :stamp="message.stamp"/>

      
    </div>
  </div>  
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style>
  .menu {
    width: 150px;
    margin-top: 100px;
  }
  .channel-icon {
    margin: 6px 0;
    background-color: white;
  }
  .right-drawer {
    background: linear-gradient(
    to right,
    #b1199f,
    #aa15b8
    );
  }
</style>

<script lang="ts">
import { ref } from 'vue'
import MessageComponent from '../components/MessageComponent.vue'

export default {
  components: {
    MessageComponent
  },
  setup () {
    const leftDrawerOpen = ref(true);
    const rightDrawerOpen = ref(true);

    const messages = [
    {
      name: 'me',
      avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
      text: ['This is my sent message'],
      stamp: 'Just now'
    },
    {
      name: 'Jane',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      text: ['This is a received message'],
      stamp: '5 minutes ago'
    },
    {
      name: 'John',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      text: ['Hey, what\'s up?'],
      stamp: '10 minutes ago'
    }
  ]

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      messages,
      /*toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },*/
      horizontalThumbStyle: {
        opacity: 0,
      },
      verticalThumbStyle: {
        width: '4px',
      }
    }
  }
}
</script>
