const srid = 3857
const meterPerTileArr = [
  40075016.685578488,
  20037508.342789244,
  10018754.171394621,
  5009377.085697311,
  2504688.542848655,
  1252344.271424328,
  626172.135712164,
  313086.067856082,
  156543.033928041,
  78271.51696402,
  39135.75848201,
  19567.879241005,
  9783.939620503,
  4891.969810251,
  2445.984905126,
  1222.992452563,
  611.496226281,
  305.748113141,
  152.87405657,
  76.437028285,
  38.218514143,
  19.109257071,
  9.554628536,
]
const origin = [-20037508.342789244, 20037508.342789244]
const originMinX = origin[0]
const originMaxY = origin[1]

const extent = `postgis.ST_MakeEnvelope($1, $2, $3, $4, ${srid})`
const extentIntersection = `postgis.ST_Intersects(geom, ${extent})`
const getFilters = sourceSetName => {
  return `AND tile_layer_id IN (
    SELECT tile_layer_id FROM data.tile_set_layers WHERE zoom_range @> $5::numeric AND tile_set_id = (
      SELECT id FROM data.tile_sets WHERE name = $6
    )
  ) AND tile_layer_id IN (
    SELECT id FROM data.tile_layers WHERE tile_source_set_id = (
      SELECT id FROM data.tile_source_sets WHERE name = '${sourceSetName}'
    )
  )`
}
const roadWidthRatio = '(CASE WHEN tile_layer_id IN (3) THEN 0.5 ELSE 1 END)::float'
const sourceSets = {
  'locations': `locations AS (
    SELECT postgis.ST_AsMVT(q, 'locations') tile FROM (
      SELECT props, postgis.ST_AsMvtGeom(geom, ${extent}) geom FROM (
        SELECT jsonb_build_object(
          'layer', 'boundary_'||tile_layer_id 
        ) props, geom FROM data.locations WHERE ${extentIntersection} ${getFilters('locations')}
        UNION        
        SELECT jsonb_build_object(
          'layer', 'label_'||tile_layer_id,
          'label', name
        ) props, postgis.ST_PointOnSurface(geom) geom FROM data.locations WHERE ${extentIntersection} ${getFilters('locations')}
      )t
    )q    
  ),`,   
  'road_lines': `road_lines AS (
    SELECT postgis.ST_AsMVT(q, 'road_lines') tile FROM (
      SELECT props, postgis.ST_AsMvtGeom(geom, ${extent}) geom FROM (
        SELECT jsonb_build_object(
          'width_ratio', ${roadWidthRatio}
        ) props, geom FROM data.collection WHERE ${extentIntersection} ${getFilters('road_lines')}
        UNION
        SELECT jsonb_build_object(
          'width_ratio', ${roadWidthRatio},
          'level', level
        ) props, geom FROM data.road_levels WHERE ${extentIntersection} ${getFilters('road_lines')}
      )t
    )q    
  ),`,
  'road_labels': `road_labels AS (
    SELECT postgis.ST_AsMVT(q, 'road_labels') tile FROM (
      SELECT props, postgis.ST_AsMvtGeom(geom, ${extent}) geom FROM (
        SELECT jsonb_build_object(
          'label', name
        ) props, geom FROM data.locations WHERE ${extentIntersection} ${getFilters('road_labels')}        
      )t
    )q
  ),`,
  'collection': `collection AS (
    SELECT postgis.ST_AsMVT(q, 'collection') tile FROM (
      SELECT props, postgis.ST_AsMvtGeom(geom, ${extent}) geom FROM (
        SELECT jsonb_build_object(
          'layer', CASE WHEN tile_layer_id IN (6,7)
            THEN 'polygon_'||tile_layer_id 
              ELSE 'line_'||tile_layer_id 
            END
        ) props, geom FROM data.collection WHERE ${extentIntersection} ${getFilters('collection')}        
      )t
    )q
  ),`, 
}

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

    getQuery(sourcesetNames) {
      let ctes = 'WITH '
      let select = 'SELECT '
      let from = 'FROM '
      sourcesetNames.forEach(name => {
        ctes += sourceSets[name]
        select += `${name}.tile || `
        from += `${name}, `
      })
      return `${ctes.slice(0, -1)} ${select.slice(0, -4)} tile ${from.slice(0, -2)}`
    },

    getParams({ tilesetName, z, x, y }) {
      const minX = originMinX + meterPerTileArr[z] * x
      const minY = originMaxY - meterPerTileArr[z] * y
      const maxX = minX + meterPerTileArr[z]
      const maxY = minY - meterPerTileArr[z]
      return [ minX, minY, maxX, maxY, z, tilesetName ]
    },
    
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

  app.get('/tile/:tilesetName/:z/:x/:y', {
    schema: { 
      type: 'object',
      properties: {
        tilesetName: { type: 'string', pattern: '^[a-z\\d]+$' },
        z: { type: 'integer' },
        x: { type: 'integer' },
        y: { type: 'integer' },
      },
    } 
  }, async (request, _reply) => {
    const { tilesetName, z, x, y } = request.params      
    const sourcesetNames = await app.tileset.getSourcesetNames(tilesetName)
    if (!sourcesetNames) {
      return
    }
    const query = await app.tileset.getQuery(sourcesetNames)
    const params = app.tileset.getParams({ tilesetName, z, x, y })
    return await app.tileset.getTile(query, params)
  })

  done()
}