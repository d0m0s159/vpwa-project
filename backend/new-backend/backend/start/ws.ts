import app from '@adonisjs/core/services/app'
import Ws from '#services/Ws'
import ChannelManager from '#services/ChannelManager'
app.ready(() => {
  Ws.boot()
  const io = Ws.io
  const channelManager = new ChannelManager()

    io?.on('connection', async (socket) => {
      console.log(`Client connected: ${socket.id}`)

      await channelManager.ensureNamespace('general')
    })
})

auth: () => import('#middleware/auth_middleware')
