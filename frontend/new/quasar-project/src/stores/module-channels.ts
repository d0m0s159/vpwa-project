import { defineStore } from 'pinia'
import { SerializedMessage, RawMessage } from 'src/contracts'
import { channelService } from 'src/services'

export interface ChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  active: string | null;
}

export const useChannelStore = defineStore('channel', {
  state: () : ChannelsStateInterface => ({
    loading: false,
    error: null,
    messages: {},
    active: null
  }),

  getters: {
    joinedChannels: (state) => Object.keys(state.messages),

    currentMessages: (state) =>
      state.active !== null ? state.messages[state.active] : [],

    lastMessageOf: (state) => (channel: string) => {
      const messages = state.messages[channel]
      return messages && messages.length > 0 ? messages[messages.length - 1] : null
    }
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
    },

    async join (channel: string) {
      try {
        this.LOADING_START()
        const messages = await channelService.join(channel).loadMessages()
        this.LOADING_SUCCESS(channel, messages)
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
      const newMessage = await channelService.in(channel)?.addMessage(message)
      if (newMessage) {
        this.NEW_MESSAGE(channel, newMessage)
      }
    }
  }
})
