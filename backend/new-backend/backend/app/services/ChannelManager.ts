//Do not export from this file, export instance from start/ws

import Ws from '#services/Ws'
import Channel from '#models/channel'
import { SerializedMessage } from '../contracts/message.js'
import Message from '#models/message'
import { DateTime } from 'luxon'
import User from '#models/user'
import Kick from '#models/kick'
import Ban from '#models/ban'

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

        socket.on('kick', async (data, callback) => {
          console.log(`Kick in ${channelName} namespace:`, data.nickname)
          const user = await User.findBy('nickname', data.nickname)
          const channel = await Channel.findBy('name', channelName)
          const isRelated = await user?.related('channels').query().where('channels.id', channel!.id).first()
          if(isRelated){
            if(channel?.adminId === data.kickedBy){
              const ban = await Kick.query().where('user_id', user!.id)
                .andWhere('channel_id', channel!.id).first()
              if(!ban){
                await Ban.create({
                  userId: user?.id,
                  channelId: channel?.id
                })

                const kicks = await Kick.query().where('target_user_id', user!.id)
                .andWhere('channel_id', channel!.id)

                for(const kick of kicks){
                  await kick.delete()
                }
  
                if (callback) callback(null, 'banned');
                socket.broadcast.emit('ban', user?.id)
              }
              else{
                if (callback) callback(null, 'User was already banned');
              }
            }
            else{
              const kick = await Kick.query().where('target_user_id', user!.id)
                .andWhere('performed_by', data.kickedBy)
                .andWhere('channel_id', channel!.id).first()
              if(!kick){
                await Kick.create({
                  channelId: channel?.id,
                  performedBy: data.kickedBy,
                  targetUserId: user?.id
                })
                if(callback) callback({status: 'User kicked'})

                  const kickCount = await Kick.query()
                  .where('target_user_id', user!.id)
                  .andWhere('channel_id', channel!.id)

                  if (kickCount.length >= 3) {
                    await Ban.create({
                      channelId: channel!.id,
                      userId: user!.id,
                    })

                    user?.related('channels').detach([channel!.id])

                    const kicks = await Kick.query().where('target_user_id', user!.id)
                    .andWhere('channel_id', channel!.id)

                    for(const kick of kicks){
                      await kick.delete()
                    }
                    
                    socket.broadcast.emit('ban', user?.id)
                  }
              }

              if(callback) callback({status: 'You already kicked this user'})
            }
          }
          if(callback) callback({status: 'Not existing user'})
        })

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
            content: data.message,
            channelId: channel!.id,
            createdAt: DateTime.now().toString(),
            updatedAt: DateTime.now().toString(),
            id: message.id,
            author: {
              id: user!.id,
              nickname: user!.nickname!,
              email: user!.email
            }
          }

          if (callback) callback(null, newData);

          socket.broadcast.emit('message', newData)
        })

        socket.on('loadMessages', async (callback) => {
          const channel = await Channel.findBy('name', channelName)
          const messages = await Message.query().where('channel_id', channel!.id)
          const serialized_messages: SerializedMessage[] = []
          for(const message of messages){
            const user = await User.findBy('id', message.userId)
            const temp_message: SerializedMessage = {
              content: message.text,
              channelId: message.channelId,
              createdAt: message.createdAt.toString(),
              updatedAt: message.createdAt.toString(),
              id: message.id,
              author: {
                id: message.userId,
                nickname: user!.nickname!,
                email: user!.email
              }
            }
            serialized_messages.push(temp_message)
          }
          if (callback) {
            if (serialized_messages){
              callback(null, serialized_messages)
            }
            else{
              callback(null, [])};
            }
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

      namespace?.emit('channel_deleted', {
        channel: channelName,
        message: `Channel "${channelName}" has been deleted.`,
      })

      namespace?.sockets.forEach((socket) => {
        socket.disconnect(true)
      })

      this.namespaces.delete(channelName)

      console.log(`Namespace ${channelName} deleted`)
    }
  }
}

export default ChannelManager
