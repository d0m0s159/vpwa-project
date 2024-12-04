import app from '@adonisjs/core/services/app'
import Ws from '#services/Ws'
import ChannelManager from '#services/ChannelManager'

let channelManager: ChannelManager | null = null


const userSocketMap = new Map<string, string>()

app.ready(() => {
  Ws.boot()
  const io = Ws.io

  channelManager = new ChannelManager()

  io?.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('registerUser', (data, callback) => {
      userSocketMap.set(data.userName, socket.id)
      console.log(`User ${data.userName} registered with socket ID: ${socket.id}`)

      if (callback) callback(null, true)
    })

    socket.on('invitation', (callback) => {

      if (callback) callback(null, { status: 'sent' })
    })

    socket.on('disconnect', () => {
      for (const [userName, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userName)
          console.log(`User ${userName} disconnected and removed from mapping`)
          break
        }
      }
    })
  })
})

auth: () => import('#middleware/auth_middleware')

export { channelManager } // Export this channelManager instance for app to work correctly