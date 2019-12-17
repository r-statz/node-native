
exports.up = async function(knex, Promise) {
  await knex.schema.createTable('users', table => {
    table.increments()
    table.string('login').notNullable()
    table.string('name').notNullable()
    table.string('password_digest').notNullable()
    table.timestamps()
  })
  knex.raw('CREATE UNIQUE INDEX users_login_index ON users (lower(login));')
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('users')
};

