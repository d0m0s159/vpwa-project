import { defineStore } from 'pinia';
import type { Channel } from '../channel';

export const useChannelsStore = defineStore('channels', {
    state: () => {
        return {
            channelList: [
                { messageList: [], name: 'General', userlist: [], admin: '', public: true},
            ] as Channel[],
        }
    },
    actions: {
        sendMessage(mName: string, mText: string[], mStamp: string, index: number) {
            this.channelList[index].messageList.push({name: mName, text: mText,stamp: mStamp});
        },
    }
})