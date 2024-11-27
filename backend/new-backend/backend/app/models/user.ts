import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Channel from './channel.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nickname: string | null

  @column()
  declare firstname: string | null

  @column()
  declare surname: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: 'active' | 'offline' | 'dnd'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Channel)
  declare channels: ManyToMany<typeof Channel>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
