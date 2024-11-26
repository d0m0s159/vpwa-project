import { defineStore } from 'pinia'
import { channelService } from 'src/services'
import type { SerializedMessage, RawMessage } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean
  error: Error | null
  messages: { [channel: string]: SerializedMessage[] }
  active: string | null
}

export const useChannelsStore = defineStore('channels', {
  // State
  state: (): ChannelsStateInterface => ({
    loading: false,
    error: null,
    messages: {},
    active: null
  }),

  // Getters
  getters: {
    joinedChannels (state): string[] {
      return Object.keys(state.messages)
    },
    currentMessages (state): SerializedMessage[] {
      return state.active !== null ? state.messages[state.active] : []
    },
    lastMessageOf (state) {
      return (channel: string): SerializedMessage | null => {
        const messages = state.messages[channel]
        return messages?.length > 0 ? messages[messages.length - 1] : null
      }
    }
  },

  // Actions
  actions: {
    async join (channel: string) {
      try {
        this.loading = true
        this.error = null
        const messages = await channelService.join(channel).loadMessages()
        this.messages[channel] = messages
      } catch (err) {
        this.error = err as Error
        throw err
      } finally {
        this.loading = false
      }
    },

    async leave (channel: string | null) {
      const leaving: string[] =
        channel !== null ? [channel] : this.joinedChannels

      leaving.forEach((c) => {
        channelService.leave(c)
        delete this.messages[c]
      })

      if (this.active && !this.joinedChannels.includes(this.active)) {
        this.active = null
      }
    },

    async addMessage (channel: string, message: RawMessage) {
      try {
        const newMessage = await channelService.in(channel)?.addMessage(message)
        if (newMessage) {
          this.messages[channel].push(newMessage)
        }
      } catch (err) {
        this.error = err as Error
        throw err
      }
    },

    setActive (channel: string) {
      this.active = channel
    }
  }
})
