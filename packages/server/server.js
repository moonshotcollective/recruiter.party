const fastify = require('fastify')({ logger: true })
const mercurius = require('mercurius')
const mongoose = require('mongoose')
const config = require('config')
const { schema } = require('./graphql/schema')
const { resolvers } = require('./graphql/resolvers')
const { makeCeramicClient } = require('./helpers/ceramic')

const { corsOptions, sessionOptions, dbUrl, host, port } = config.get('API_CONFIG.api')

fastify.register(require('fastify-cors'), {
  ...corsOptions
})

fastify.register(require('fastify-secure-session'), {
  cookieName: sessionOptions.cookieName,
  key: Buffer.from(sessionOptions.key, 'hex'),
  cookie: {
    ...sessionOptions.cookie
  }
})

fastify.register(require('./routes'))
fastify.register(mercurius, {
  schema,
  resolvers,
  graphiql: true
})

// Run the server!
const start = async () => {
  try {
    await mongoose.connect(dbUrl)
    fastify.log.info('DB connected')
    const client = await makeCeramicClient()
    fastify.decorate('ceramic', { client })
    await fastify.listen(port, host)
  } catch (err) {
    fastify.log.error(err)
    throw Error(err)
  }
}

start()
