import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { User } from '../user'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => {
    return {
      user: reactive(
        { name: 'Peter', status: 'online' }
      ) as User
    }
  },
  actions: {
    setUserName (name: string) {
      this.user.name = name
    },
    setUserStatus (status: string) {
      this.user.status = status
    }
  }
})
