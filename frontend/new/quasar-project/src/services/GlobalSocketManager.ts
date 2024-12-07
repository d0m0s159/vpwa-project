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

  sendInvitation (userNickname: string, channelName: string, invitedBy: number) {
    return this.emitAsync('invitation', { userNickname, channelName, invitedBy })
  }
}

const globalSocketManager = new GlobalSocketManager()
export default globalSocketManager
