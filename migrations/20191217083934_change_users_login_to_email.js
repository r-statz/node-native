
exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('users', t => {
    t.renameColumn('login', 'email')
  })
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('users', t => {
    t.renameColumn('email', 'login')
  })
};
