const { updateProfile } = require('../services/profiles')
const DEBUG = process.env.DEBUG

module.exports = function (fastify, opts, done) {
  fastify.post('/profiles/:tokenId', async (request, reply) => {
    try {
      const userAddress = request.session.get('address')
      if (!/^0x[A-Za-z0-9]{40}$/.test(userAddress)) {
        reply.code(401)
        return { message: 'Invalid/missing address in session' } // validate that address exists in session
      }

      const profile = await updateProfile(request.params.tokenId)

      if (DEBUG) console.log('Profile: ', profile)

      return { profile }
    } catch (err) {
      fastify.log.error(err)
      reply.code(500)
      return {}
    }
  })

  done()
}
