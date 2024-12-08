import app from '@adonisjs/core/services/app'
import Ws from '#services/Ws'
import ChannelManager from '#services/ChannelManager'
import Channel from '#models/channel'
import ChannelInvitation from '#models/channel_invitation'
import User from '#models/user'
import Ban from '#models/ban'

let channelManager: ChannelManager | null = null


const userSocketMap = new Map<string, string>()

app.ready(() => {
  Ws.boot()
  const io = Ws.io

  channelManager = new ChannelManager()

  io?.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('registerUser', async (data, callback) => {
      const user = await User.findBy('nickname', data.nickname)
      if(user){
        user.status = 'active'
        await user.save()
        const channels = await user.related('channels').query()
        channels.forEach((channel) => {
          const namespace = channelManager?.getNamespace(channel.name)
          if (namespace) {
            namespace.emit('statusUpdate', {
              userId: user.id,
              nickname: user.nickname,
              status: user.status,
              channel: channel.name
            })
          }
        })
      }
      userSocketMap.set(data.nickname, socket.id)
      console.log(`User ${data.nickname} registered with socket ID: ${socket.id}`)

      if (callback) callback(null, true)
    })

    socket.on('invitation', async (data, callback) => {
      console.log('new invitation')
      const channel = await Channel.findBy('name', data.channelName)
      const user = await User.findBy('nickname', data.userNickname)
      if(channel && user){
        const socketId = userSocketMap.get(user.nickname!)
        const findInvitation = await ChannelInvitation.query()
            .where('target_user_id', user.id)
            .andWhere('channel_id', channel.id)
            .first()
        const isRelated = await user?.related('channels').query().where('channels.id', channel.id).first()

        if(!findInvitation && !isRelated){
          if(channel.isPublic && data.revoke !== 'revoke'){
            const invitation = await ChannelInvitation.create({
              channelId: channel.id,
              targetUserId: user.id,
              performedBy: data.invitedBy
            })
            console.log(socketId)
            if(socketId){
              console.log('invitation sending')
              io.to(socketId).emit('invitation', {
                invitationId: invitation.id,
                channel: channel.name,
                message: 'You have been invited to a new channel!'
              })
            }
          }
          else{
            if(channel.adminId === data.invitedBy){
              const ban = await Ban.query().where('user_id', user!.id)
                .andWhere('channel_id', channel!.id).first()
              ban?.delete()
              const invitation = await ChannelInvitation.create({
                channelId: channel.id,
                targetUserId: user.id,
                performedBy: data.userId
              })
              console.log(socketId)
              if(socketId){
                console.log('invitation sending')
                io.to(socketId).emit('invitation', {
                  invitationId: invitation.id,
                  channel: channel.name,
                  message: 'You have been invited to a new channel!'
                })
              }
            }
          }
          if (callback) callback(null, { status: 'sent' })
        }
        if (callback) callback(null, { status: 'use has been already invited' })
      }
      if (callback) callback(null, { status: 'no user' })
    })

    socket.on('statusUpdate', async (data, callback) => {
      const newUser = data.user
  
      const user = await User.findBy('id', newUser.id)
      if (!user) {
        if (callback) callback({ error: 'User not found' })
        return
      }
  
      user.status = newUser.status
      await user.save()
  
      const channels = await user.related('channels').query()
      channels.forEach((channel) => {
        const namespace = channelManager?.getNamespace(channel.name)
        if (namespace) {
          namespace.emit('statusUpdate', {
            userId: user.id,
            nickname: user.nickname,
            status: newUser.status,
            channel: channel.name
          })
        }
      })
  
      console.log(`Updated status for ${newUser.nickname} to ${newUser.status}`)
  
      if (callback) callback(null, { status: 'success' })
    })

    socket.on('disconnect', async () => {
      for (const [nickname, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(nickname)
          console.log(`User ${nickname} disconnected and removed from mapping`)

          const user = await User.findBy('nickname', nickname)
          if(user){
            user.status = 'offline'
            await user.save()

            const channels = await user.related('channels').query()
            channels.forEach((channel) => {
              const namespace = channelManager?.getNamespace(channel.name)
              if (namespace) {
                namespace.emit('statusUpdate', {
                  userId: user.id,
                  nickname: user.nickname,
                  status: user.status,
                  channel: channel.name
                })
              }
            })
          }
          break
        }
      }
    })
  })
})

auth: () => import('#middleware/auth_middleware')

export { channelManager } // Export this channelManager instance for app to work correctly