const environment = process.env.NODE_ENV || 'development'
const knexConfig = require('./knexfile')[environment]
const knex = require('knex')(knexConfig)

module.exports = knex

// var config      = require('./knexfile.js');
// var env         = 'development';
// var knex        = require('knex')(config[env]);
//  console.log(knex, "knex")
// module.exports = knex;