'use strict'

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { build } from '../app.js'

const opts = {
  // logger: {
  //   level: 'info',
  //   transport: { 
  //     target: 'pino-pretty',
  //     options: {
  //       translateTime: 'SYS:standard',
  //       ignore: 'pid,hostname',
  //     },
  //   }
  // }
}
// export DB_URI='postgres://tileset:pass@172.25.2.1:5432/tileset'

test('Valid home page', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/',
  })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.headers['content-type'], 'text/html')
})

test('Not valid home page', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/abc',
  })
  assert.strictEqual(response.statusCode, 404)
})

test('Valid params', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/tile/map1/17/93442/48053',
  })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.headers['content-type'], 'application/octet-stream')
})

test('Missing Y param', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/tile/map1/17/93442',
  })
  assert.strictEqual(response.statusCode, 404)
})

test('Wrong pattern X param', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/tile/map1/17/93442abc/48053',
  })
  assert.strictEqual(response.statusCode, 400)
})

test('Wrong pattern tilesetName param', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/tile/map--1/17/93442/48053',
  })
  assert.strictEqual(response.statusCode, 400)
})

test('Unknown tilesetName param', async () => {
  const app = await build(opts)
  const response = await app.inject({
    method: 'GET',
    url: '/tile/map11/17/93442/48053',
  })
  assert.strictEqual(response.statusCode, 404)
})