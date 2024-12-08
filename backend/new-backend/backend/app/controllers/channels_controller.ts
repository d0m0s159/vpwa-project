import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import User from '#models/user'
import { DateTime } from 'luxon'
import { channelManager } from '#start/ws'
import ChannelInvitation from '#models/channel_invitation'
import Ban from '#models/ban'

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

      const invitations = await ChannelInvitation.query().where('target_user_id', userId)
      const joinableChannels = [] as {name:string, invitationId:number}[]
      for(const invitation of invitations){
        const channel = await Channel.findBy('id', invitation.id)
        joinableChannels.push({name: channel!.name, invitationId: invitation.id})
      }
      console.log(joinableChannels)

      return { succes: true, channels: user.channels, joinableChannels: joinableChannels}
    }

    public async joinChannel({ request }: HttpContext) {
      const channelName = request.body().channelName
      const userId = request.body().user
      const channel = await Channel.findBy('name', channelName)

      if(!channel){
        const newChannel = await Channel.create({
          name: channelName,
          adminId: (userId != 0) ? userId : null,
          isPublic: request.body().isPublic,
          lastActivity: DateTime.now(),
        })
        channelManager?.ensureNamespace(channelName)

        const user = await User.findBy('id', userId)
        await user?.related('channels').attach([newChannel.id])
      }
      else{
        const ban = await Ban.query()
          .where('channel_id', channel.id)
          .andWhere('user_id', userId).first()
        console.log(!ban)
        if(!ban){
          if(channel.isPublic){
            const invitation = await ChannelInvitation.query()
              .where('target_user_id', userId)
              .andWhere('channel_id', channel.id)
              .first()
            if(invitation){
              await invitation.delete()
            }
            const user = await User.findBy('id', userId)
            await user?.related('channels').attach([channel.id])

            return { success: true, message: 'Channel has been joined' }
          }
          else{
            const invitation = await ChannelInvitation.query()
              .where('target_user_id', userId)
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
        return { success: false, message: 'You are banned' }
      }
      return { success: true, message: 'Channel has been created' }
    }

    public async leaveChannel({ request }: HttpContext){
      const channelName = request.body().channelName
      const userId = request.body().user
      const user = await User.findBy('id', userId)
      const channel = await Channel.findBy('name', channelName)

      if(channel){
        if( channel.adminId === user?.id){
          await user?.related('channels').detach([channel.id])
          channelManager?.deleteNamespace(channelName)
          await channel.delete()
          return { success: true, message: 'Channel has been deleted' }
        }
        if(request.body().quit !== 'quit'){
          await user?.related('channels').detach([channel.id])
          return { success: true, message: 'You left the channel' }
        }
        return { success: false, message: 'You cannot use quit' }
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
        const isRelated = await user?.related('channels').query().where('channels.id', channel.id).first()

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