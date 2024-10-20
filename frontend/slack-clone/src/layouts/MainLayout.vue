<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>

        <q-toolbar-title shrink>
          Slack
        </q-toolbar-title>

        <div class="q-toolbar-spacer"></div>


        <h6 class="selected-channel-name">
          {{ selectedChannelName }}
        </h6>


        <div class="q-toolbar-spacer"></div>

        <q-btn
          round
          unelevated
          >

          <q-avatar size="40px" icon="account_circle"/>

          <q-menu
            class="menu"
            :offset="[10,4]">
            <q-list >
              <q-item clickable v-close-popup @click="openStatusDialog">
                <q-avatar icon="account_circle"></q-avatar>
                <q-item-section>Set Status</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/auth/login">
                <q-avatar icon="directions" />
                <q-item-section>Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>
        <div :class="['status-indicator', userStore.user.status]"></div>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="statusDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Set Status</div>
        </q-card-section>

        <q-card-section>
          <q-btn flat label="Online" color="green" @click="setStatus('online')" />
          <q-btn flat label="Offline" color="gray" @click="setStatus('offline')" />
          <q-btn flat label="DND" color="red" @click="setStatus('dnd')" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
  .list-container {
    width: 70px;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    overflow-y: auto;
    background-color: var(--q-color-primary);
  }
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: relative;
    top: 15px;
    right: 7px;
  }

  .status-indicator.online {
    background-color: green;
  }

  .status-indicator.offline {
    background-color: gray;
  }

  .status-indicator.dnd {
    background-color: red;
  }

  .q-toolbar-spacer {
    flex: 1;
  }

  .selected-channel-name {
    margin: 0;
    text-align: center;
  }
</style>

<script lang="ts">
import { ref, computed } from 'vue'
import { useCurrentUserStore } from 'src/components/stores/useCurrentUserStore';
import { useChannelsStore } from 'src/components/stores/useChannelsStore';

export default {
  setup () {
    const leftDrawerOpen = ref(true);
    const rightDrawerOpen = ref(true);

    const statusDialogOpen = ref(false);
    const userStore = useCurrentUserStore();
    const channelStore = useChannelsStore();

    const openStatusDialog = () => {
      statusDialogOpen.value = true;
    };

    const setStatus = (status: string) => {
      userStore.setUserStatus(status);
      statusDialogOpen.value = false;
    };

    const selectedChannelName = computed(() => channelStore.selectedChannelName);

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      statusDialogOpen,
      openStatusDialog,
      setStatus,
      userStore,
      channelStore,
      selectedChannelName
    }
  }
}
</script>
