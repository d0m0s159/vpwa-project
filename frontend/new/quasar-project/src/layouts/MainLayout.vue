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
              <q-item clickable v-close-popup @click="logOut" to="auth/login">
                <q-avatar icon="directions" />
                <q-item-section>Log out</q-item-section>
              </q-item>
              <q-item v-if="notificationPermission !== 'granted'" clickable v-close-popup @click="requestNotificationPermission">
                <q-avatar icon="notifications" />
                <q-item-section>Enable Notifications</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>
        <div :class="['status-indicator', user!.status]"></div>

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
          <q-btn flat label="active" color="green" @click="setStatus('active')" />
          <q-btn flat label="Offline" color="gray" @click="setStatus('offline')" />
          <q-btn flat label="dnd" color="red" @click="setStatus('dnd')" />
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

  .status-indicator.active {
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
import { ref, computed, onMounted } from 'vue'
import { useChannelStore } from 'src/stores/module-channels'
import { useAuthStore } from 'src/stores/useAuthStore'
import globalSocketManager from 'src/services/GlobalSocketManager'
import { api } from 'src/boot/axios'
import { channelService } from 'src/services'

export default {
  setup () {
    const leftDrawerOpen = ref(true)
    const rightDrawerOpen = ref(true)

    const statusDialogOpen = ref(false)
    const notificationPermission = ref(Notification.permission)
    const channelStore = useChannelStore()
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const openStatusDialog = () => {
      statusDialogOpen.value = true
    }

    const setStatus = async (status: 'active' | 'dnd' | 'offline') => {
      const oldStatus = authStore.user!.status
      authStore.setUserStatus(status)
      globalSocketManager.setStatus(authStore.user!)

      if (oldStatus === 'offline' && status !== 'offline') {
        globalSocketManager.reconnectSocket()
        channelStore.messages = {}
        channelStore.users = {}
        const { data } = await api.post('/load/channels/', { id: authStore.user?.id })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const channel of data.channels) {
          try {
            channelStore.join(channel.name)
          } catch (err) {
            console.error(`Error joining channel ${channel.name}:`, err)
          }
        }

        for (const channel of data.joinableChannels) {
          try {
            console.log(`${channel.name},${channel.invitationId}`)
            channelStore.addJoinable(channel.name, channel.invitationId)
          } catch (err) {
            console.error(`Error joining channel ${channel.name}:`, err)
          }
        }
      } else if (status === 'offline') {
        globalSocketManager.disconnectSocket()
        channelService.handleUserStatusChange()
      }
      statusDialogOpen.value = false
    }

    const selectedChannelName = computed(() => channelStore.active)

    const requestNotificationPermission = () => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted.')
          } else {
            console.log('Notification permission denied.')
          }
        })
      }
    }

    const logOut = () => {
      authStore.logout()
    }

    onMounted(() => {
      notificationPermission.value = Notification.permission
    })

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      statusDialogOpen,
      openStatusDialog,
      setStatus,
      channelStore,
      selectedChannelName,
      user,
      logOut,
      requestNotificationPermission,
      notificationPermission
    }
  }
}
</script>
