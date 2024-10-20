import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { Channel } from '../channel';

export const useChannelsStore = defineStore('channels', {
    state: () => {
        return {
            channelList: reactive([
                {
                    messageList: [
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                        { name: 'Peter', text: ['Ahoj'], stamp: 'dnes' },
                    ],
                    name: 'General',
                    userlist: [{name: 'Peter'}],
                    admin: '',
                    public: true
                },
                {
                    messageList: [
                        { name: 'John', text: ['Hello'], stamp: 'today' },
                        { name: 'John', text: ['Hello'], stamp: 'today' },
                    ],
                    name: 'Random',
                    userlist: [],
                    admin: '',
                    public: true
                },
                {
                    messageList: [
                        { name: 'Alice', text: ['Hi'], stamp: 'today' },
                        { name: 'Alice', text: ['Hi'], stamp: 'today' },
                    ],
                    name: 'Tech',
                    userlist: [],
                    admin: '',
                    public: true
                },
            ]) as Channel[],
            joinableChannelList: [
              {
                  messageList: [
                      { name: 'John', text: ['Hello'], stamp: 'today' },
                  ],
                  name: 'Random',
                  userlist: [],
                  admin: '',
                  public: true
              },
              {
                  messageList: [
                      { name: 'Alice', text: ['Hi'], stamp: 'today' },
                  ],
                  name: 'Tech',
                  userlist: [],
                  admin: '',
                  public: true
              },
          ] as Channel[],
          notificationsEnabled: true,
          notifyOnlyAddressed: false,
          channelListSize: 3,
        }
    },
    actions: {
        sendMessage(mName: string, mText: string[], mStamp: string, index: number) {
            this.channelList[index].messageList.push({name: mName, text: mText, stamp: mStamp});
        },
        createChannel(channelName: string) {
          this.channelList.push({
              messageList: [],
              name: channelName,
              userlist: [],
              admin: '',
              public: true
          });
        },
        moveChannelToJoined(index: number) {
          const channel = this.joinableChannelList.splice(index, 1)[0];
          this.channelList.push(channel);
        },
    }
});
