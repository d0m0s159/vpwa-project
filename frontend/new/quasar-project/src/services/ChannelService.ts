import { RawMessage, SerializedMessage, User } from 'src/contracts'
import { SocketManager } from './SocketManager'
import { useChannelStore } from 'src/stores/module-channels'
import { useAuthStore } from 'src/stores/useAuthStore'

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  private store = useChannelStore()
  public subscribe (): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: SerializedMessage) => {
      this.store.NEW_MESSAGE(channel, message)
    })
  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    const userStore = useAuthStore()
    const data = { message, userEmail: userStore.user?.email }
    return this.emitAsync('addMessage', data)
  }

  public loadUsers (): Promise<User[]> {
    return this.emitAsync('loadUsers')
  }

  public loadMessages (): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages')
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public join (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

  public leave (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }
}

export default new ChannelService()
