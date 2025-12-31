import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import dotenv from 'dotenv'
import { join } from 'desm'

dotenv.config({path: join(import.meta.url, '..', '.env')})

const app = Fastify({ 
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {        
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:standard',
      },
    },
  } 
})

app.register(fastifyStatic, {
  root: [
    join(import.meta.url, '..', '/build/client'),
    join(import.meta.url, '..', '/'),
  ],
  setHeaders: res => {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
})

app.listen({ port: process.env.STATIC_PORT }, function (err) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})