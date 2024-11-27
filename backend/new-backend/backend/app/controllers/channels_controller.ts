import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import User from '#models/user'
import { DateTime } from 'luxon'
import { channelManager } from '#start/ws'

export default class ChannelsController {
    // Function to load channels for a specific user
    public async loadChannels({ request }: HttpContext) {
      // Access the userId from the params object
      const userId = request.body().id
  
      // Fetch the user with their associated channels
      const user = await User.query()
        .where('id', userId)
        .preload('channels')  // Make sure 'channels' is a valid relationship in the User model
        .first()
  
      if (!user) {
        return { message: 'User not found' }
      }
  
      // Return the channels associated with the user
      return user.channels
    }

    public async ensureChannel({ request }: HttpContext) {
      const channelName = request.body().channelName;
      const userId = request.body().user; // Assuming this is the ID of the user
      const channel = await Channel.findBy('name', channelName)
      if(!channel){
        await Channel.create({
          name: channelName,
          adminId: (userId != 0) ? userId : null,
          isPublic: true,
          lastActivity: DateTime.now(),
        })
        channelManager?.ensureNamespace(channelName)
      }
      return
    }
  }