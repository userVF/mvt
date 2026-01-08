'use strict'

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { getQuery, getParams } from '../utils/tileset.js'

test('Get query', () => {
  const query = getQuery([
    'locations', 
    'road_lines', 
    'road_labels', 
    'collection', 
  ])
  assert.strictEqual(query.slice(-51), 'FROM locations, road_lines, road_labels, collection')
})

test('Get params', () => {
  const params = getParams({ tilesetName: 'map1', z: 17, x: 93442, y: 48053 })
  assert.deepStrictEqual(params, [
    8532206.845332075,
    5345394.262024771,
    8532512.593445215,
    5345088.51391163,
    17,
    'map1',
  ])
  
})