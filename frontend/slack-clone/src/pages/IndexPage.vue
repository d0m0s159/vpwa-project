<template>
  <q-page>
    <div class="example-row-all-breakpoints">
      <div class="row justify-between">
        <div class="col-auto">
          <div class="channel-list">
            <div v-for="(channel, index) in joinableChannels" :key="index">
              <q-btn no-caps square unelevated size="0px" padding="0px" color="amber-7" @click="openJoinDialog(channel.name, index)">
                <q-avatar class="channel-icon" text-color="black">
                  {{ getInitials(channel.name) }}
                </q-avatar>
              </q-btn>
            </div>
            <div v-for="(channel, index) in channels" :key="index">
              <q-btn no-caps square unelevated size="0px" padding="0px" color="red" @click="selectChannel(index)">
                <q-avatar class="channel-icon" text-color="black">
                  {{ getInitials(channel.name) }}
                </q-avatar>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col q-ml-sm self-end q-mb-sm">
          <div class="q-pa-md q-mt-sm row">
            <div style="width: 100%; max-width: 1000px">
              <q-scroll-area ref="scrollArea" style="height: 72vh;">
                <q-infinite-scroll @load="onLoad" reverse :disable="infiniteScroll">
                  <template v-slot:loading>
                    <div v-if="loading" class="row justify-center q-my-md">
                      <q-spinner color="primary" name="dots" size="40px" />
                    </div>
                  </template>
                  <MessageComponent
                    v-for="(message, index) in messages"
                    :key="index"
                    :name="message.name"
                    :text="message.text"
                    :stamp="message.stamp"
                  />
                </q-infinite-scroll>
              </q-scroll-area>
            </div>
          </div>
          <div class="row">
            <q-input class="col input-message" outlined rounded v-model="text" label="Message">
              <template v-slot:after>
                <q-btn round dense flat icon="send" @click="sendMsg" />
              </template>
            </q-input>
          </div>
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
          <div class="text-h6">Users in {{ channels[index].name }}</div>
        </q-card-section>

        <q-card-section>
          <div v-for="user in channels[index]?.userlist" :key="user.name">
            {{ user.name }}
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
</style>

<script lang="ts">
import { ref, computed, nextTick } from 'vue';
import MessageComponent from 'src/components/MessageComponent.vue';
import { useChannelsStore } from 'src/components/stores/useChannelsStore';
import { Message } from 'src/components/message';
import { QScrollArea } from 'quasar';

export default {
  components: {
    MessageComponent
  },
  setup() {
    const store = useChannelsStore();

    const channels = computed(() => store.channelList);
    const joinableChannels = computed(() => store.joinableChannelList);

    const messages = ref<Message[]>([]);
    const fullMessages = ref<Message[]>([]);

    const index = ref(0);
    let limit = 7;

    const loadMessages = () => {
      if (channels.value.length > 0 && channels.value[index.value].messageList) {
        fullMessages.value = channels.value[index.value].messageList;
        messages.value = fullMessages.value.slice(-limit);
      }
    };

    loadMessages();

    const text = ref('');
    const scrollArea = ref<InstanceType<typeof QScrollArea> | null>(null);
    const infiniteScroll = ref(false);
    const loading = ref(true);
    const joinDialog = ref(false);
    const userListDialog = ref(false);
    const selectedChannel = ref('');

    const sendMsg = async () => {
      const date = new Date();
      const dateFormat = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
      const messageText = text.value.trim();

      if (messageText.startsWith('/join ') || messageText.startsWith('/create ')) {
        const command = messageText.split(' ')[0];
        const channelName = messageText.slice(command.length).trim();
        let channelIndex = joinableChannels.value.findIndex(channel => channel.name === channelName);
        if (channelIndex === -1) {
          // Channel not found, create it
          store.createChannel(channelName);
          channelIndex = joinableChannels.value.length - 1; // New channel will be at the end of the joinableChannels list
        }
        index.value = channelIndex;
      } else if (messageText.startsWith('/cancel')) {
        if (index.value >= 0) {
          store.channelList.splice(index.value, 1);
          console.log(`Deleted channel: ${selectedChannel.value}`);
          selectedChannel.value = '';
          index.value = -1;
          messages.value = [];
        }
      } else if (messageText.startsWith('/list')) {
        if (index.value >= 0) {
          userListDialog.value = true;
        }
      } else if (messageText) {
        store.sendMessage('me', [messageText], dateFormat, index.value);
        limit++;
        messages.value = fullMessages.value.slice(-limit);
        await nextTick();
        scrollToEnd();
      }

      text.value = '';
    };

    const scrollToEnd = () => {
      if (scrollArea.value) {
        scrollArea.value.setScrollPosition('vertical', 10000);
      }
    };

    const onLoad = (index: number, done: () => void) => {
      setTimeout(() => {
        if (limit < fullMessages.value.length - limit) {
          limit += limit;
          messages.value = fullMessages.value.slice(-limit);
        } else if (limit < fullMessages.value.length) {
          limit = fullMessages.value.length;
          messages.value = fullMessages.value.slice(-limit);
        } else {
          infiniteScroll.value = false;
          loading.value = false;
        }
        done();
      }, 2000);
    };

    const getInitials = (name: string) => {
      return name.split(' ').map(word => word[0]).join('').toLowerCase();
    };

    const openJoinDialog = (channelName: string, channelIndex: number) => {
      selectedChannel.value = channelName;
      index.value = channelIndex;
      joinDialog.value = true;
    };

    const joinChannel = () => {
      if (index.value >= 0) {
        store.moveChannelToJoined(index.value);
        console.log(`Joined channel: ${selectedChannel.value}`);
        joinDialog.value = false;
      }
    };

    const selectChannel = (channelIndex: number) => {
      console.log(`Selected channel index before: ${index.value}`)
      index.value = channelIndex;
      store.setSelectedChannelIndex(channelIndex);
      console.log(`Selected channel index after: ${index.value}`);
      limit = 7;
      loadMessages();
    };

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
      index
    };
  }
};
</script>
