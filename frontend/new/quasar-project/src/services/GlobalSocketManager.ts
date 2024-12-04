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

  registerUser (userEmail: string) {
    console.log('trying to register')
    return this.emitAsync('registerUser', { userEmail })
  }

  sendInvitation (userEmail: string, channelName: string) {
    return this.emitAsync('invitation', { userEmail, channelName })
  }
}

const globalSocketManager = new GlobalSocketManager()
export default globalSocketManager
