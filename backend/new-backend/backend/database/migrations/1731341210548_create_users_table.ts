import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('firstname').nullable()
      table.string('surname').nullable()
      table.string('nickname').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.enu('status', ['active', 'offline', 'dnd']).notNullable().defaultTo('offline')
      table.timestamp('created_at').notNullable().defaultTo(DateTime.now())
      table.timestamp('updated_at').nullable().defaultTo(DateTime.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
