import { getQuery, getParams, schema } from '../utils/tileset.js'

export default function(app, _opts, done) {

  app.decorate('tileset', {
    async getSourcesetNames(tilesetName) {
      const client = await app.pg.connect()      
      try {
        const result = await client.query(`SELECT array_agg(name) names FROM data.tile_source_sets WHERE id IN (
          SELECT unnest(tile_source_set_ids) FROM data.tile_sets WHERE name = $1 AND is_enabled = true
        )`, [ tilesetName ])
        return result.rows[0]['names']
      } catch (err) {
        app.log.error(err)
      } finally {
        client.release()
      }
    },
    getQuery,
    getParams,    
    async getTile(query, params) {
      const client = await app.pg.connect()      
      try {
        const result = await client.query(query, params)
        return result.rows[0]['tile']
      } catch (err) {
        app.log.error(err)
      } finally {
        client.release()
      }
    },
  })

  app.get('/tile/:tilesetName/:z/:x/:y', { schema }, async (request, reply) => {
    const { tilesetName, z, x, y } = request.params      
    const sourcesetNames = await app.tileset.getSourcesetNames(tilesetName)
    if (!sourcesetNames) {
      reply.code(404)
      return      
    }
    const query = app.tileset.getQuery(sourcesetNames)
    const params = app.tileset.getParams({ tilesetName, z, x, y })
    return await app.tileset.getTile(query, params)
  })

  done()
}