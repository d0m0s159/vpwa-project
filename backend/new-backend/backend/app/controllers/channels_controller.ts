import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import User from '#models/user'
import { DateTime } from 'luxon'
import { channelManager } from '#start/ws'
import ChannelInvitation from '#models/channel_invitation'

export default class ChannelsController {

    public async loadChannels({ request }: HttpContext) {
      const userId = request.body().id
      const user = await User.query()
        .where('id', userId)
        .preload('channels')
        .first()
  
      if (!user) {
        return { succes: false, message: 'User not found' }
      }

      return { succes: true, channels: user.channels}
    }

    public async joinChannel({ request }: HttpContext) {
      const channelName = request.body().channelName
      const userId = request.body().user
      const channel = await Channel.findBy('name', channelName)

      if(!channel){
        const newChannel = await Channel.create({
          name: channelName,
          adminId: (userId != 0) ? userId : null,
          isPublic: true,
          lastActivity: DateTime.now(),
        })
        channelManager?.ensureNamespace(channelName)

        const user = await User.findBy('id', userId)
        await user?.related('channels').attach([newChannel.id])
      }
      else{
        if(channel.isPublic){
          const user = await User.findBy('id', userId)
          await user?.related('channels').attach([channel.id])
        }
        else{
          const invitation = await ChannelInvitation.query()
            .where('targetUser', userId)
            .andWhere('channel_id', channel.id)
            .first()
          if(invitation){
            const user = await User.findBy('id', userId)
            await user?.related('channels').attach([channel.id])

            await invitation.delete()

            return { success: true, message: 'Channel has been joined' }
          }
          else{
            return { success: false, message: 'Channel is private. Invitation required' }
          }
        }
      }
      return { success: true, message: 'Channel has been created' }
    }

    public async leaveChannel({ request }: HttpContext){
      const channelName = request.body().channelName
      const userId = request.body().user
      const user = await User.findBy('id', userId)
      const channel = await Channel.findBy('name', channelName)
      console.log(channelName)
      if(channel){
        if( channel.admin === user){
          channelManager?.deleteNamespace(channelName)
          await channel.delete()
          return { success: true, message: 'Channel has been deleted' }
        }
        await user?.related('channels').detach([channel.id])
      }
      else{
        return { success: false, message: 'Channel does not exist' }
      }
      return { success: true, message: 'Channel has been left' }
    }

    public async listUsers( {request}: HttpContext ){
      const channelName = request.body().channelName
      const userId = request.body().user
      const user = await User.findBy('id', userId)
      const channel = await Channel.findBy('name', channelName)

      if(channel){
        const isRelated = await user?.related('channels').query().where('id', channel.id)

        if (isRelated) {
          const users = await channel.related('users').query()
          return { succes: true, users: users}
        } else {
          return { success: false, message: 'User is not related to the channel' }
        }
      }

      return { success: false, message: 'User or channel not found' }
    }
  }