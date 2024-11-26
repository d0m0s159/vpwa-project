import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel from '#models/channel'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await Channel.createMany([
      {
        name: 'general',
        isPublic: true,
        adminId: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        lastActivity: DateTime.now(),
        admin: null
      },

    ])
  }
}