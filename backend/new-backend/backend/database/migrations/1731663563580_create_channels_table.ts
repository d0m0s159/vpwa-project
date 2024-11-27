import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable().unique()
      table.boolean('is_public').notNullable().defaultTo(true)
      table.integer('admin_id').unsigned().references('id').inTable('users').onDelete('CASCADE').defaultTo(null)
      table.timestamp('last_activity', { useTz: true }).notNullable().defaultTo(DateTime.now())
      table.timestamp('created_at').defaultTo(DateTime.now())
      table.timestamp('updated_at').defaultTo(DateTime.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
