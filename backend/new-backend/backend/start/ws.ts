import app from '@adonisjs/core/services/app'
import Ws from '#services/Ws'
import ChannelManager from '#services/ChannelManager'
import Channel from '#models/channel'
import ChannelInvitation from '#models/channel_invitation'
import User from '#models/user'

let channelManager: ChannelManager | null = null


const userSocketMap = new Map<string, string>()

app.ready(() => {
  Ws.boot()
  const io = Ws.io

  channelManager = new ChannelManager()

  io?.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('registerUser', (data, callback) => {
      userSocketMap.set(data.nickname, socket.id)
      console.log(`User ${data.nickname} registered with socket ID: ${socket.id}`)

      if (callback) callback(null, true)
    })

    socket.on('invitation', async (data, callback) => {
      const channel = await Channel.findBy('name', data.channelName)
      const user = await User.findBy('nickname', data.userNickname)
      if(channel && user){
        const socketId = userSocketMap.get(user.nickname!)
        const invitation = await ChannelInvitation.create({
          channelId: channel.id,
          targetUserId: user.id,
          performedBy: data.userId
        })
        if(socketId){
          io.to(socketId).emit('invitation', {
            invitationId: invitation.id,
            channel: channel.name,
            message: 'You have been invited to a new channel!'
          })
        }
        if (callback) callback(null, { status: 'sent' })
      }
      if (callback) callback(null, { status: 'no user' })
    })

    socket.on('disconnect', () => {
      for (const [nickname, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(nickname)
          console.log(`User ${nickname} disconnected and removed from mapping`)
          break
        }
      }
    })
  })
})

auth: () => import('#middleware/auth_middleware')

export { channelManager } // Export this channelManager instance for app to work correctly