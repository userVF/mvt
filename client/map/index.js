import { Map } from 'maplibre-gl'

import { getTileLayers } from './tile-layers.js'

const createMap = tileSetName => {
  new Map({
    container: 'map',
    attributionControl: false,
    refreshExpiredTiles: false,
    doubleClickZoom: false,
    touchPitch: false, 
    pitchWithRotate: false,
    hash: true,
    center: [76.648749, 43.218107],
    zoom: 16,
    minZoom: 16,
    maxZoom: 18,
    maxBounds: [
      [76.6361752035205, 43.213333766168525],
      [76.66042971619171, 43.22315348347854],
    ],
    style: {
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      version: 8,
      sources: {
        mvt: {
          type: 'vector',
          tiles: [ `${import.meta.env.VITE_APP_ORIGIN}/tile/${tileSetName}/{z}/{x}/{y}` ]		
        },        
      },     
      layers: getTileLayers(),      
    },
  })  
}

export { createMap }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              