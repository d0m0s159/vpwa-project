import { defineStore } from 'pinia'
import { SerializedMessage, RawMessage, User } from 'src/contracts'
import { channelService } from 'src/services'
import { useAuthStore } from './useAuthStore'
// import { useQuasar } from 'quasar'

export interface ChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  joinable: {[channel: string]: number}
  active: string | null;
  activeUser: number | null;
  users: { [channel: string]: User[] };
  typingUsers: {[channel:string ]: { [userId: number]: { nickname: string, content: string } }}
  notificationsEnabled: boolean;
}

export const useChannelStore = defineStore('channel', {
  state: () : ChannelsStateInterface => ({
    loading: false,
    error: null,
    messages: {},
    joinable: {},
    active: null,
    activeUser: null,
    users: {},
    typingUsers: {},
    notificationsEnabled: true
  }),

  getters: {
    joinedChannels: (state) => Object.keys(state.messages),

    currentMessages: (state) =>
      state.active !== null ? state.messages[state.active] : [],

    currentUsers: (state) =>
      state.active !== null ? state.users[state.active] : [],

    lastMessageOf: (state) => (channel: string) => {
      const messages = state.messages[channel]
      return messages && messages.length > 0 ? messages[messages.length - 1] : null
    },

    joinableChannels: (state) => Object.keys(state.joinable),

    currentTypingUsers: (state) => state.active !== null ? state.typingUsers[state.active] : [],

    currentActiveUser: (state) => (state.active !== null && state.activeUser !== null)
      ? state.typingUsers[state.active][state.activeUser] : []
  },

  actions: {
    LOADING_START () {
      this.loading = true
      this.error = null
    },

    LOADING_SUCCESS (channel: string, messages: SerializedMessage[]) {
      this.loading = false
      this.messages[channel] = messages
    },

    SET_USERS (channel: string, users: User[]) {
      this.users[channel] = users
    },

    LOADING_ERROR (error: Error) {
      this.loading = false
      this.error = error
    },

    CLEAR_CHANNEL (channel: string) {
      this.active = null
      delete this.messages[channel]
    },

    SET_ACTIVE (channel: string) {
      this.active = channel
    },

    NEW_MESSAGE (channel: string, message: SerializedMessage) {
      if (!this.messages[channel]) {
        this.messages[channel] = []
      }
      this.messages[channel].push(message)
      // const $q = useQuasar()
      const authStore = useAuthStore()
      if (authStore.user && authStore.user.id !== message.author.id && authStore.user.status !== 'dnd') {
        this.send_notification(message.author.nickname, message.content)
      }
    },

    send_notification (author: string, message: string) {
      console.log('sending notification')
      // eslint-disable-next-line no-new
      new Notification(author, {
        body: message,
        icon: '/path/to/icon.png'
      })
    },

    SET_TYPING_USER (channelName: string, userId: number, nickname: string, typing: boolean, content: string) {
      if (!this.typingUsers[channelName]) {
        this.typingUsers[channelName] = {}
      }

      if (typing) {
        this.typingUsers[channelName][userId] = { nickname, content }
      } else {
        delete this.typingUsers[channelName][userId]
      }
    },

    updateUser (userId: number, userStatus: 'active' | 'dnd' | 'offline', channel: string) {
      if (this.users[channel]) {
        const user = this.users[channel].find(user => user.id === userId)
        if (user) {
          user.status = userStatus
        } else {
          console.error(`User with id ${userId} not found in channel ${channel}`)
        }
      } else {
        console.error(`Channel ${channel} does not exist in users`)
      }
    },

    async handleTyping (userId: number, nickname: string, channel: string, typing: boolean, content: string) {
      const callback = await channelService.in(channel)?.handleTyping(userId, nickname, channel, typing, content)
      console.log(callback)
    },

    async join (channel: string) {
      try {
        this.LOADING_START()
        const newChannel = await channelService.join(channel)
        console.log(newChannel)
        const messages = await newChannel.loadMessages()
        const users = await newChannel.loadUsers()

        this.LOADING_SUCCESS(channel, messages)
        this.SET_USERS(channel, users)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.LOADING_ERROR(err)
        throw err
      }
    },

    async kick (channel: string, nickname: string) {
      try {
        await channelService.in(channel)?.kick(nickname)
        console.log(channel)
        console.log(nickname)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.LOADING_ERROR(err)
        throw err
      }
    },

    async leave (channel: string | null) {
      const leaving = channel !== null ? [channel] : this.joinedChannels
      leaving.forEach((c) => {
        channelService.leave(c)
        this.CLEAR_CHANNEL(c)
      })
    },

    async addMessage (channel: string, message: RawMessage) {
      console.log('writing message')
      const newMessage = await channelService.in(channel)?.addMessage(message)
      console.log('message came')
      if (newMessage) {
        this.NEW_MESSAGE(channel, newMessage)
      }
    },

    addJoinable (channel: string, invitationId: number) {
      if (!this.messages[channel]) {
        this.joinable[channel] = invitationId
      }
    }
  }
})
