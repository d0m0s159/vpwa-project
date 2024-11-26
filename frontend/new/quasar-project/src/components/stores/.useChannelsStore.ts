import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Channel } from '../channel'

export const useChannelsStore = defineStore('channels', {
  state: () => {
    return {
      channelList: reactive([]) as Channel[],
      joinableChannelList: reactive([]) as Channel[],
      notificationsEnabled: true,
      notifyOnlyAddressed: false,
      channelListSize: 3,
      selectedChannelIndex: 0
    }
  },
  actions: {
    sendMessage (mName: string, mText: string[], mStamp: string, index: number) {
      this.channelList[index].messageList.push({ name: mName, text: mText, stamp: mStamp })
    },
    createChannel (channelName: string) {
      this.channelList.push({
        messageList: [],
        name: channelName,
        userlist: [],
        admin: '',
        public: true
      })
    },
    moveChannelToJoined (index: number) {
      const channel = this.joinableChannelList.splice(index, 1)[0]
      this.channelList.push(channel)
    },
    setSelectedChannelIndex (index: number) {
      this.selectedChannelIndex = index
    }
  },
  getters: {
    selectedChannelName: (state) => {
      if (state.selectedChannelIndex >= 0 && state.selectedChannelIndex < state.channelList.length) {
        return state.channelList[state.selectedChannelIndex].name
      }
      return ''
    }
  }
})
