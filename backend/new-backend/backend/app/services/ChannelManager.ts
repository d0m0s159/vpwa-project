import Ws from '#services/Ws'
import Channel from '#models/channel' // Assuming you have a Lucid model for channels

class ChannelManager {
  private io = Ws.io!
  
  private namespaces: Map<string, ReturnType<typeof this.io.of>> = new Map()

  constructor() {
    if (this.io) {
      this.loadChannels()
    }
  }

  // Load all existing channels from the database and create namespaces
  private async loadChannels() {
    const channels = await Channel.all()

    channels.forEach((channel) => {
      this.createNamespace(channel.name)
    })
  }

  // Create a new namespace and store it in the namespaces map
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

        // Handle events in the namespace
        socket.on('message', (data) => {
          console.log(`Message in ${channelName} namespace:`, data)

          // Broadcast the message to others in the namespace
          socket.broadcast.emit('message', data)
        })

        // Handle disconnection
        socket.on('disconnect', (reason) => {
          console.log(
            `Socket disconnected from /channels/${channelName}: ${reason}`
          )
        })
      })

      // Save namespace reference
      this.namespaces.set(channelName, namespace)
    }
  }

  // Check if a namespace exists, and if not, create it and a database record
  public async ensureNamespace(channelName: string) {
    if (!this.namespaces.has(channelName)) {
      console.log(`Namespace for channel "${channelName}" does not exist. Creating it...`)

      // Create the channel in the database if it doesn't exist
      const channel = await Channel.firstOrCreate({ name: channelName })
      this.createNamespace(channel.name)
    }
  }
}

export default ChannelManager