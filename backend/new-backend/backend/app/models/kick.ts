import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import Channel from './channel.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Kick extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare channelId: number

  @column()
  declare performedBy: number

  @column()
  declare targetUserId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare targetUser: BelongsTo<typeof User>

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
