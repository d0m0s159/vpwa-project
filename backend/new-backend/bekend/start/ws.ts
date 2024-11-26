import app from '@adonisjs/core/services/app'
import Ws from '#services/Ws'
app.ready(() => {
  Ws.boot()
  const io = Ws.io
  io?.on('connection', (socket) => {
    console.log(socket.id)
  })
  const generalNamespace = io?.of('/channels/general')

  generalNamespace?.on('connection', (socket) => {
    console.log(`Socket connected to /channels/general with ID: ${socket.id}`)

    // Handle events specific to /channels/general
    socket.on('message', (data) => {
      console.log('Message in /channels/general namespace:', data)
    })
  })
})
