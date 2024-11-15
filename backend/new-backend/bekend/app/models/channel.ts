import { DateTime } from 'luxon'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isPublic: boolean

  @column()
  declare adminId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare lastActivity: DateTime

  @belongsTo(() => User, {
    foreignKey: 'adminId',
  })
  declare admin: BelongsTo<typeof User>

  @manyToMany(() => User)
  declare users: ManyToMany<typeof User>

}
