<template>
  <q-page>
    <div class="example-row-all-breakpoints">
      <div class="row justify-between main-page">
        <div class="col-auto">
          <div class="channel-list">
            <div v-for="(channel, index) in joinableChannels" :key="index">
              <q-btn no-caps square unelevated size="0px" padding="0px" color="amber-7" @click="openJoinDialog(channel, index)">
                <q-avatar class="channel-icon" text-color="black">
                  {{ getInitials(channel) }}
                </q-avatar>
              </q-btn>
            </div>
            <div v-for="(channel, index) in channels" :key="index">
              <q-btn no-caps square unelevated size="0px" padding="0px" color="red" @click="selectChannel(index, channel)">
                <q-avatar class="channel-icon" text-color="black">
                  {{ getInitials(channel) }}
                </q-avatar>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
        <div class="col self-end q-mb-sm">
          <div class="row">
            <div style="width: 1000px; max-width: 1000px">
              <q-scroll-area ref="scrollArea" style="height: 76vh;">
                <q-infinite-scroll @load="onLoad" reverse :disable="infiniteScroll">
                  <template v-slot:loading>
                    <div v-if="loading" class="row justify-center q-my-sm">
                      <q-spinner color="primary" name="dots" size="40px" />
                    </div>
                  </template>
                  <q-chat-message
                    v-for="(message, index) in latestMessages"
                    :key="index"
                    :name="message.author.nickname"
                    :text="[message.content]"
                    :stamp="message.createdAt"
                    :sent="isUser(message.author.id)"
                    :bg-color="isTagged(message) ? 'amber-6' : ''"
                  />
                </q-infinite-scroll>
              </q-scroll-area>
            </div>
          </div>
          <div class="row">
            <q-input class="col input-message" outlined rounded v-model="text" bg-color="white" label="Message" @update:model-value="handleTyping">
              <template v-slot:after>
                <q-btn round dense flat icon="send" @click="sendMsg" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-md-1">
          <div v-for="(typingUser, userId) in typingUsers" :key="userId">
            <q-card @click="showTypingDialog(userId)" class="clickable-card">
              <q-card-section>
                <q-card-title>
                  {{ typingUser.nickname }} is typing...
                </q-card-title>
              </q-card-section>
            </q-card>
          </div>

          <q-dialog v-model="typingDialog">
            <q-card>
              <q-card-section>
                <h6>{{ activeTypingUser.nickname }}'s Message:</h6>
                <p>{{ activeTypingUser.content }}</p>
              </q-card-section>
              <q-card-actions>
                <q-btn flat label="Close" @click="typingDialog = false" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>

    <q-dialog v-model="joinDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Join Channel</div>
        </q-card-section>

        <q-card-section>
          Do you want to join the channel "{{ selectedChannel }}"?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Join" color="positive" @click="joinChannel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="userListDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Users in {{ channels[index] }}</div>
        </q-card-section>
        <q-card-section>
          <div v-for="(user, id) in userList" :key="id">
            {{ user.nickname }}: {{ user.status }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped lang="scss">
  h1 {
    margin-top: 0px
  }
  .input-message {
    width: 100%;
    max-width: 1050px;
  }
  .channel-icon {
    margin: 6px;
    background-color: white;
  }
  .channel-icon .joinable {
    background-color: teal;
  }
  .channel-list {
    height: calc(100vh - 50px);
    overflow-y: auto;
    background-color: $red;
  }
  .main-page {
    background-color: $red-3;
  }
  .clickable-card {
    cursor: pointer;
  }
</style>

<script lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useChannelStore } from 'src/stores/module-channels'
import { QScrollArea, useQuasar } from 'quasar'
import { SerializedMessage } from 'src/contracts'
import { useAuthStore } from 'src/stores/useAuthStore'
import { api } from 'src/boot/axios'
import globalSocketManager from 'src/services/GlobalSocketManager'

export default {
  setup () {
    const $q = useQuasar()
    const store = useChannelStore()
    const authStore = useAuthStore()
    const channels = computed(() => store.joinedChannels)
    console.log(channels)

    store.LOADING_SUCCESS('test-channel', [])
    console.log('After adding channel:', store.joinedChannels)
    console.log(channels.value)
    store.CLEAR_CHANNEL('test-channel')
    console.log('After clearing channel:', store.joinedChannels)
    const joinableChannels = computed(() => store.joinableChannels)
    const typingUsers = computed(() => store.currentTypingUsers)

    const userList = computed(() => store.currentUsers)

    const messages = ref<SerializedMessage[]>([])
    const fullMessages = ref<SerializedMessage[]>([])

    const index = ref(0)
    let limit = 7

    const text = ref('')
    const scrollArea = ref<InstanceType<typeof QScrollArea> | null>(null)
    const infiniteScroll = ref(false)
    const loading = ref(true)
    const joinDialog = ref(false)
    const userListDialog = ref(false)
    const selectedChannel = ref('')

    const typingDialog = ref(false)
    const activeTypingUser = computed(() => store.currentActiveUser)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showTypingDialog = (userId: number) => {
      store.activeUser = userId
      console.log(store.activeUser)
      typingDialog.value = true
    }

    const loadMessages = () => {
      if (store.active) {
        if (channels.value.length > 0 && store.messages[store.active].length > 0) {
          fullMessages.value = store.messages[store.active]
          messages.value = fullMessages.value.slice(-limit)
          loading.value = true
          infiniteScroll.value = false
        }
      }
    }

    loadMessages()

    const sendMsg = async () => {
      const messageText = text.value.trim()
      if (messageText.startsWith('/join ') || messageText.startsWith('/create ')) {
        const splittedMessage = messageText.split(' ')
        const channelName = splittedMessage[1]
        const channelType = splittedMessage[2]?.toLowerCase() || 'public'
        const isPublic = channelType === 'public'
        const response = await api.post('/channels/join', { channelName, isPublic, user: Number(authStore.user!.id) })
        if (response.data.success) {
          store.join(channelName)
        }
      } else if (messageText.startsWith('/cancel')) {
        if (index.value >= 0) {
          console.log(`Deleted channel: ${store.active}`)
          const channelName = store.active
          await api.post('/channels/leave', { channelName: store.active, user: Number(authStore.user!.id), quit: 'cancel' })
          text.value = ''
          handleTyping()
          store.leave(channelName)
        }
      } else if (messageText.startsWith('/quit')) {
        if (index.value >= 0) {
          console.log(`Deleted channel: ${store.active}`)
          const channelName = store.active
          const response = await api.post('/channels/leave', { channelName: store.active, user: Number(authStore.user!.id), quit: 'quit' })
          text.value = ''
          handleTyping()
          if (response.data.success === true) {
            store.leave(channelName)
          }
        }
      } else if (messageText.startsWith('/list')) {
        if (index.value >= 0) {
          userListDialog.value = true
        }
      } else if (messageText.startsWith('/invite')) {
        console.log('invite')
        const command = messageText.split(' ')[0]
        const nickname = messageText.slice(command.length).trim()
        globalSocketManager.sendInvitation(nickname, store.active!, authStore.user!.id, 'invite')
      } else if (messageText.startsWith('/revoke')) {
        console.log('revoke')
        const command = messageText.split(' ')[0]
        const nickname = messageText.slice(command.length).trim()
        globalSocketManager.sendInvitation(nickname, store.active!, authStore.user!.id, 'revoke')
      } else if (messageText.startsWith('/kick')) {
        const command = messageText.split(' ')[0]
        const nickname = messageText.slice(command.length).trim()
        store.kick(store.active!, nickname)
      } else if (messageText && store.active) {
        console.log('adding message')
        console.log(store.active)
        store.addMessage(store.active, messageText)
        limit++
        await nextTick()
        scrollToEnd()
      }
      text.value = ''
      handleTyping()
    }

    const scrollToEnd = () => {
      if (scrollArea.value) {
        scrollArea.value.setScrollPosition('vertical', 10000)
      }
    }

    const onLoad = (index: number, done: () => void) => {
      setTimeout(() => {
        if (limit < fullMessages.value.length - limit) {
          limit += limit
          messages.value = fullMessages.value.slice(-limit)
        } else if (limit < fullMessages.value.length) {
          limit = fullMessages.value.length
          messages.value = fullMessages.value.slice(-limit)
        } else {
          infiniteScroll.value = true
          loading.value = false
        }
        done()
      }, 2000)
    }

    const getInitials = (name: string) => {
      return name.split(' ').map(word => word[0]).join('').toLowerCase()
    }

    const openJoinDialog = (channelName: string, channelIndex: number) => {
      selectedChannel.value = channelName
      index.value = channelIndex
      joinDialog.value = true
    }

    const joinChannel = async () => {
      if (index.value >= 0) {
        console.log(`Joined channel: ${selectedChannel.value}`)
        await api.post('/channels/join', { channelName: selectedChannel.value, user: Number(authStore.user!.id) })
        store.join(selectedChannel.value)
        delete store.joinable[selectedChannel.value]
        joinDialog.value = false
      }
    }

    const selectChannel = (channelIndex: number, channelName: string) => {
      text.value = ''
      handleTyping()
      console.log(`Selected channel index before: ${index.value}`)
      index.value = channelIndex
      store.SET_ACTIVE(channelName)
      console.log(`Selected channel index after: ${index.value}`)
      limit = 7
      loadMessages()
    }

    const handleTyping = () => {
      if (index.value >= 0) {
        const content = text.value.trim()
        store.handleTyping(
          authStore.user!.id,
          authStore.user!.nickname,
          store.active!,
          content.length > 0,
          content)
      }
    }

    const isTagged = (message: SerializedMessage) => {
      return message.content.includes(`@${authStore.user?.nickname}`)
    }

    const isUser = (id: number) => {
      return id === authStore.user?.id
    }

    const latestMessages = computed(() => {
      console.log('Current messages:', store.currentMessages)
      return store.currentMessages
    })

    watch(() => store.messages, () => {
      if (document.hidden) {
        console.log('sending notification')
        const latestMessage = store.lastMessageOf(store.active!)
        if (latestMessage) {
          // eslint-disable-next-line no-new
          new Notification('New Message', {
            body: latestMessage.content
          })
        }
      }
    })

    return {
      channels,
      joinableChannels,
      messages,
      text,
      scrollArea,
      infiniteScroll,
      loading,
      sendMsg,
      scrollToEnd,
      onLoad,
      getInitials,
      openJoinDialog,
      joinChannel,
      joinDialog,
      userListDialog,
      selectedChannel,
      selectChannel,
      index,
      isUser,
      latestMessages,
      userList,
      handleTyping,
      typingUsers,
      activeTypingUser,
      showTypingDialog,
      typingDialog,
      isTagged,
      $q
    }
  }
}
</script>
