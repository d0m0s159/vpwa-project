<template>
  <q-page>
    <div class="example-row-all-breakpoints">
      <div class="row justify-between">
        <div class="col-auto">
          <div class="channel-list">
          <div v-for="n in 3" :key="n">
            <q-btn no-caps square unelevated size="0px" padding="0px" color="teal">
              <q-avatar class="channel-icon" text-color="black">
                new
              </q-avatar>
            </q-btn>
          </div>
          <div v-for="(channel, index) in channels" :key="index">
            <q-btn no-caps square unelevated size="0px" padding="0px" color="red">
              <q-avatar class="channel-icon" text-color="black">
                oh no
              </q-avatar>
            </q-btn>
          </div>
          </div>
        </div>
        <div class="col q-ml-sm self-end q-mb-sm">
          <div class="q-pa-md q-mt-xl row">
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
                  :stamp="message.stamp"/>
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
  </q-page>
</template>

<style scoped>
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
  .channel-list {
    height: calc(100vh - 50px);
    overflow-y: auto
  }
</style>

<script lang="ts">
import { ref, computed } from 'vue';
import MessageComponent from 'src/components/MessageComponent.vue'; 
import { useChannelsStore } from 'src/components/stores/useChannelsStore';
import { Message } from 'src/components/message';
import { QScrollArea } from 'quasar';
import { nextTick } from 'vue';

export default {
  components: {
    MessageComponent
  },
  setup() {
    const store = useChannelsStore();

    const channels = computed(() => store.channelList);

    const messages = ref<Message[]>([]);
    const fullMessages = ref<Message[]>([]);
    
    const index = ref(0);
    let limit = 7;

    if (channels.value.length > 0 && channels.value[0].messageList) {
      fullMessages.value = channels.value[0].messageList;
      messages.value = fullMessages.value.slice(-limit);
    }

    const text = ref('');
    const scrollArea = ref<InstanceType<typeof QScrollArea> | null>(null);
    const infiniteScroll = ref(false)
    const loading = ref(true);

    const sendMsg = async () => {
      const date = new Date();
      const dateFormat = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
      if (text.value) {
        store.sendMessage('me', [text.value], dateFormat, index.value);
        text.value = '';
        limit++;
        messages.value = fullMessages.value.slice(-limit);
        await nextTick();
        scrollToEnd();
      }
    };

    const scrollToEnd = () => {
      if(scrollArea.value){
        scrollArea.value.setScrollPosition('vertical', 10000);
      }
    }

    const onLoad = (index:number, done: () => void) => {
      setTimeout(() => {
          if(limit < fullMessages.value.length - limit){
            limit += limit
            messages.value = fullMessages.value.slice(-limit);
          }
          else if(limit < fullMessages.value.length){
            limit = fullMessages.value.length
            messages.value = fullMessages.value.slice(-limit);
          }
          else{
            infiniteScroll.value = false;
            loading.value = false;
          }
          done()
        }, 2000)
    }

    return {
      channels,
      messages,
      text,
      scrollArea,
      infiniteScroll,
      loading,
      sendMsg,
      scrollToEnd,
      onLoad,
    };
  }
};
</script>
