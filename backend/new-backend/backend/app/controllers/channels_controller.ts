import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import User from '#models/user'
import { DateTime } from 'luxon'

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
      const channelName = request.body().channel;
      const userId = request.body().user; // Assuming this is the ID of the user
  
      // Fetch the user instance to ensure it exists (optional, based on your logic)
      const user = await User.find(userId);
  
      if (!user) {
        return { message: 'User not found' };
      }
  
      // Create or update the channel and set the adminId field
      const channel = await Channel.firstOrCreate({
        name: channelName,
        adminId: userId,
        isPublic: true,
        lastActivity: DateTime.now(),
      });
  
      return channel;
    }
  }