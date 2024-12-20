import { defineStore } from 'pinia'
import { authService, authManager } from 'src/services'
import type { LoginCredentials, RegisterData, User } from 'src/contracts'
import { useChannelStore } from './module-channels'
import { api } from 'src/boot/axios'
import globalSocketManager from 'src/services/GlobalSocketManager'

// Define the shape of the Auth State
export interface AuthStateInterface {
  user: User | null
  status: 'pending' | 'success' | 'error'
  errors: { message: string; field?: string }[]
}

// Pinia store
export const useAuthStore = defineStore('auth', {
  // State
  state: (): AuthStateInterface => ({
    user: null,
    status: 'pending',
    errors: []
  }),

  // Getters (computed properties)
  getters: {
    isAuthenticated (state): boolean {
      return state.user !== null
    }
  },

  // Actions
  actions: {
    async check () {
      const store = useChannelStore()
      this.status = 'pending'
      this.errors = []
      try {
        const user = await authService.me()
        if (user?.id !== this.user?.id) {
          const { data } = await api.post('/load/channels/', { id: user?.id })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const channel of data.channels) {
            try {
              store.join(channel.name)
            } catch (err) {
              console.error(`Error joining channel ${channel.name}:`, err)
            }
          }

          for (const channel of data.joinableChannels) {
            try {
              console.log(`${channel.name},${channel.invitationId}`)
              store.addJoinable(channel.name, channel.invitationId)
            } catch (err) {
              console.error(`Error joining channel ${channel.name}:`, err)
            }
          }
        }
        this.user = user
        console.log(this.user)
        if (user) {
          user!.status = 'active'
          await globalSocketManager.setStatus(this.user!)
          globalSocketManager.registerUser(this.user!.nickname)
        }
        this.status = 'success'
        return user !== null
      } catch (error: unknown) {
        this.handleError(error)
        throw error
      }
    },

    async register (form: RegisterData) {
      this.status = 'pending'
      this.errors = []
      try {
        const user = await authService.register(form)
        this.user = user
        this.status = 'success'
        return user
      } catch (error: unknown) {
        this.handleError(error)
        throw error
      }
    },

    async login (credentials: LoginCredentials) {
      this.status = 'pending'
      this.errors = []
      try {
        const apiToken = await authService.login(credentials)
        this.status = 'success'
        authManager.setToken(apiToken.token)
        return apiToken
      } catch (error: unknown) {
        this.handleError(error)
        throw error
      }
    },

    async logout () {
      const store = useChannelStore()
      this.status = 'pending'
      console.log(this.user)
      try {
        await authService.logout()
        await store.leave(null)
        this.user!.status = 'offline'
        await globalSocketManager.setStatus(this.user!)
        this.user = null
        this.status = 'success'
        authManager.removeToken()
      } catch (error: unknown) {
        this.handleError(error)
        throw error
      }
    },

    async setUserStatus (status: 'active' | 'dnd' | 'offline') {
      this.user!.status = status
      await api.post('/user/setStatus', { user: this.user })
    },

    // Helper method to handle errors and conform to the expected error type
    handleError (error: unknown) {
      this.status = 'error'
      if (error instanceof Error) {
        this.errors = [{ message: error.message }]
      } else {
        this.errors = [{ message: 'An unknown error occurred' }]
      }
    }
  }
})
