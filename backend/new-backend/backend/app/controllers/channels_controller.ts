import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import User from '#models/user'

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
  }