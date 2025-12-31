import fastify from 'fastify'
import fastifyPostgres from '@fastify/postgres'

import page from './plugins/page.js'
import tileset from './plugins/tileset.js'

export async function build(opts = {}) {
  const app = fastify(opts)

  app.register(fastifyPostgres, { connectionString: process.env.DB_URI })
  
  app.register(page)
  app.register(tileset)

  app.setErrorHandler(async (err, request, reply) => {
    if (err.validation) {
      reply.code(403)
      return err.message
    }
    request.log.error({ err })
    reply.code(err.statusCode || 500)

    return "I'm sorry, there was an error processing your request."
  })

  return app
}