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
          <div v-for="n in 20" :key="n">
            <q-btn no-caps square unelevated size="0px" padding="0px" color="red">
              <q-avatar class="channel-icon" text-color="black">
                oh no
              </q-avatar>
            </q-btn>
          </div>
          </div>
        </div>
        <div class="col-7">
          <div class="q-pa-md q-mt-xl">
            <div style="width: 100%; max-width: 1000px">
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
        <div class="col-1">
          
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
  h1 {
    margin-top: 0px
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

<style lang="sass">

</style>

<script>
import MessageComponent from 'src/components/MessageComponent.vue';
export default {
  components: {
    MessageComponent
  },
  setup () {
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
      messages,
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
