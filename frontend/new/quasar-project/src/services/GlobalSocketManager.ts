import { SocketManager } from 'src/services/SocketManager'

export class GlobalSocketManager extends SocketManager {
  constructor () {
    super('/')
  }

  subscribe (): void {
    const socket = this.socket

    socket.on('invitation', (data) => {
      console.log('Invitation data received:', data)
    })
  }

  registerUser (userNickname: string) {
    return this.emitAsync('registerUser', { userNickname })
  }

  sendInvitation (userNickname: string, channelName: string) {
    return this.emitAsync('invitation', { userNickname, channelName })
  }
}

const globalSocketManager = new GlobalSocketManager()
export default globalSocketManager
