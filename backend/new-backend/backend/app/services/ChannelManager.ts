//Do not export from this file, export instance from start/ws

import Ws from '#services/Ws'
import Channel from '#models/channel'
import { SerializedMessage } from '../contracts/message.js'
import Message from '#models/message'
import { DateTime } from 'luxon'
import User from '#models/user'

class ChannelManager {
  private io = Ws.io!
  
  private namespaces: Map<string, ReturnType<typeof this.io.of>> = new Map()

  constructor() {
    if (this.io) {
      this.loadChannels()
    }
  }

  private async loadChannels() {
    const channels = await Channel.all()

    channels.forEach((channel) => {
      this.createNamespace(channel.name)
    })
  }

  private createNamespace(channelName: string) {
    if (this.namespaces.has(channelName)) {
      console.log(`Namespace for channel "${channelName}" already exists`)
      return
    }

    const namespace = this.io?.of(`/channels/${channelName}`)

    if (namespace) {
      console.log(`Creating namespace for channel: ${channelName}`)

      namespace.on('connection', (socket) => {
        console.log(
          `Socket connected to /channels/${channelName} with ID: ${socket.id}`
        )

        socket.on('addMessage', async (data, callback) => {
          console.log(`Message in ${channelName} namespace:`, data)
          const channel = await Channel.findBy('name', channelName)
          const user = await User.findBy('email', data.userEmail)
          const message = await Message.create({
            userId: user!.id,
            text: data.message,
            channelId: channel?.id
          })

          const newData: SerializedMessage = {
            createdBy: user!.id,
            content: data.text,
            channelId: channel!.id,
            createdAt: DateTime.now().toString(),
            updatedAt: DateTime.now().toString(),
            id: message.id,
            author: {
              id: user!.id,
              email: user!.email
            }
          }

          if (callback) callback(null, newData);

          socket.broadcast.emit('message', newData)
        })

        socket.on('disconnect', (reason) => {
          console.log(
            `Socket disconnected from /channels/${channelName}: ${reason}`
          )
        })
      })

      this.namespaces.set(channelName, namespace)
    }
  }

  public async ensureNamespace(channelName: string) {
    if (!this.namespaces.has(channelName)) {
      console.log(`Namespace for channel "${channelName}" does not exist. Creating it...`)

      const channel = await Channel.firstOrCreate({ name: channelName })
      this.createNamespace(channel.name)
    }
  }

  public deleteNamespace(channelName: string) {
    if (this.namespaces.has(channelName)) {
      const namespace = this.namespaces.get(channelName)
      namespace?.sockets.forEach((socket) => {
        socket.disconnect(true)
      })
      
      this.namespaces.delete(channelName)

      console.log(`Namespace ${channelName} deleted`)
    }
  }
}

export default ChannelManager