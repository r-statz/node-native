module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/native'
  },
  test: {},
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}

