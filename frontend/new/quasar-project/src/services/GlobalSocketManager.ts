import { User } from 'src/contracts'
import { SocketManager } from 'src/services/SocketManager'
import { useChannelStore } from 'src/stores/module-channels'

export class GlobalSocketManager extends SocketManager {
  constructor () {
    super('/')
  }

  subscribe (): void {
    const socket = this.socket

    socket.on('invitation', (data) => {
      console.log('Invitation data received:', data)
      const channelStore = useChannelStore()
      channelStore.addJoinable(data.channel, data.invitationId)
    })
  }

  registerUser (userNickname: string) {
    return this.emitAsync('registerUser', { nickname: userNickname })
  }

  sendInvitation (userNickname: string, channelName: string, invitedBy: number, revoke: string) {
    return this.emitAsync('invitation', { userNickname, channelName, invitedBy, revoke })
  }

  setStatus (user: User) {
    return this.emitAsync('statusUpdate', { user })
  }

  public disconnectSocket (): void {
    if (this.socket.connected) {
      this.socket.disconnect()
      console.log(`${this.namespace} socket disconnected`)
    }
  }

  public reconnectSocket (): void {
    if (!this.socket.connected) {
      this.socket.connect()
      console.log(`${this.namespace} socket reconnected`)
    }
  }
}

const globalSocketManager = new GlobalSocketManager()
export default globalSocketManager
