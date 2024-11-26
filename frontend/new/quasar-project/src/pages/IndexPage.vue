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
                    v-for="(message, index) in messages"
                    :key="index"
                    :name="message.author.email"
                    :text="[message.content]"
                    :stamp="message.createdAt"
                    :sent="isUser(message.author.id)"
                  />
                </q-infinite-scroll>
              </q-scroll-area>
            </div>
          </div>
          <div class="row">
            <q-input class="col input-message" outlined rounded v-model="text" bg-color="white" label="Message">
              <template v-slot:after>
                <q-btn round dense flat icon="send" @click="sendMsg" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-md-1"></div>
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

        <!--
        <q-card-section>
          <div v-for="user in channels[index]?" :key="user.name">
            {{ user.name }}
          </div>
        </q-card-section>
      -->
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
</style>

<script lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useChannelStore } from 'src/stores/module-channels'
import { QScrollArea } from 'quasar'
import { Channel } from 'src/components/channel'
import { SerializedMessage } from 'src/contracts'
import { useAuthStore } from 'src/stores/useAuthStore'

export default {
  setup () {
    const store = useChannelStore()
    const authStore = useAuthStore()

    const channels = computed(() => store.joinedChannels)
    const joinableChannels = computed(() => [])

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
        const command = messageText.split(' ')[0]
        const channelName = messageText.slice(command.length).trim()
        let channelIndex = joinableChannels.value.findIndex((channel:Channel) => channel.name === channelName)
        if (channelIndex === -1) {
          // Channel not found, create it
          store.join(channelName)
          channelIndex = joinableChannels.value.length - 1 // New channel will be at the end of the joinableChannels list
        }
        index.value = channelIndex
      } else if (messageText.startsWith('/cancel')) {
        if (index.value >= 0) {
          console.log(`Deleted channel: ${selectedChannel.value}`)
          selectedChannel.value = ''
          index.value = -1
          messages.value = []
        }
      } else if (messageText.startsWith('/list')) {
        if (index.value >= 0) {
          userListDialog.value = true
        }
      } else if (messageText && store.active) {
        store.addMessage(store.active, messageText)
        limit++
        messages.value = fullMessages.value.slice(-limit)
        await nextTick()
        scrollToEnd()
      }

      text.value = ''
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

    const joinChannel = () => {
      if (index.value >= 0) {
        // store.moveChannelToJoined(index.value)
        console.log(`Joined channel: ${selectedChannel.value}`)
        joinDialog.value = false
      }
    }

    const selectChannel = (channelIndex: number, channelName: string) => {
      console.log(`Selected channel index before: ${index.value}`)
      index.value = channelIndex
      store.SET_ACTIVE(channelName)
      console.log(`Selected channel index after: ${index.value}`)
      limit = 7
      loadMessages()
    }

    const isUser = (id: number) => {
      return id === authStore.user?.id
    }

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
      isUser
    }
  }
}
</script>
