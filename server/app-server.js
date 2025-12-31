import { build } from './app.js'
import closeWithGrace from 'close-with-grace'
import dotenv from 'dotenv'
import { join } from 'desm'

dotenv.config({path: join(import.meta.url, '..', '.env')})

const opts = {
  logger: {
    level: 'info',
    transport: { 
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  }
}

const app = await build(opts)

await app.listen({ host: 'localhost', port: process.env.APP_PORT })

closeWithGrace(async ({ err }) => {
  if (err) {
    app.log.error({ err }, 'server closing due to error')
  }
  app.log.info('shutting down gracefully')
  await app.close()
})