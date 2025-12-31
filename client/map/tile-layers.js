const fillInterpolate = [
  'interpolate', ['exponential', 1.5], ['zoom'],
  0,  ['*', 2, ['get', 'width_ratio']],
  10, ['*', 2, ['get', 'width_ratio']],
  15, ['*', 6, ['get', 'width_ratio']],
  20, ['*', 45, ['get', 'width_ratio']],
]

const borderInterpolate = [
  'interpolate', ['exponential', 1.5], ['zoom'],
  0,  ['*', 2, ['get', 'width_ratio']],
  10, ['*', 3, ['get', 'width_ratio']],
  15, ['*', 9, ['get', 'width_ratio']],
  20, ['*', 52, ['get', 'width_ratio']]
]

const roadBorderColor = '#ccc'
const labelColor = '#333'

const getTileLayers = lang => [
  {//background
    'id': 'background',
    'type': 'background',
    'paint': {
      'background-color': '#fffef7',
      'background-opacity': 1,
    }
  },  
   {//green
    'id': 'collection-polygon-6',
    'type': 'fill',
    'source': 'mvt',
    'source-layer': 'collection',
    'filter': ['==', ['get', 'layer'], 'polygon_6'],
    'paint': {
      'fill-color': '#c0f0a8',
    }
  },
  {//water
    'id': 'collection-polygon-7',
    'type': 'fill',
    'source': 'mvt',
    'source-layer': 'collection',
    'filter': ['==', ['get', 'layer'], 'polygon_7'],
    'paint': {
      'fill-color': '#a3e5ff',
    }
  },
  {//city
    'id': 'city-boundaries',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'locations',
    'filter': ['==', ['get', 'layer'], 'boundary_1'],
    'paint': {
      'line-color': '#ccc',
      'line-width': 1,
    },
  },
  {//road line border
    'id': 'road-line-border',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'road_lines',
    'paint': {
      'line-color': roadBorderColor,
      'line-width': borderInterpolate
    }
  },          
  {//road line fill
    'id': 'road-line-fill',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'road_lines',
    'paint': {
      'line-color': '#fff',
      'line-width' : fillInterpolate
    }
  }, 
  {//road level border 10
    'id': 'road-level-border-10',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'road_lines',
    'filter': ['==', ['get', 'level'], 10],
    'paint': {
      'line-color': roadBorderColor,
      'line-width' : borderInterpolate
    }
  },          
  {//road level fill 10
    'id': 'road-level-fill-10',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'road_lines',
    'filter': ['==', ['get', 'level'], 10],
    'paint': {
      'line-color': '#fff',
      'line-width' : fillInterpolate
    }
  },          
  {//road level border 20
    'id': 'road-level-border-20',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'road_lines',
    'filter': ['==', ['get', 'level'], 20],
    'paint': {
      'line-color': roadBorderColor,
      'line-width' : borderInterpolate
    }
  },         
  {//road level fill 20
    'id': 'road-level-fill-20',
    'type': 'line',
    'source': 'mvt',
    'source-layer': 'road_lines',
    'filter': ['==', ['get', 'level'], 20],
    'paint': {
      'line-color': '#fff',
      'line-width': fillInterpolate
    }
  }, 
  {//city label
    'id': 'location-label-9',
    'type': 'symbol',
    'source': 'mvt',
    'source-layer': 'locations',
    'filter': ['==', ['get', 'layer'], 'label_1'],
    'layout': {
      'text-size': 12,
      'symbol-placement': 'point',
      'text-field': ['get', 'label'],
    },
    'paint': {
      'text-color': labelColor,
      'text-halo-color': '#fff',
      'text-halo-width': .7,
    },
  },  
  {//road label
    'id': 'road-label',
    'type': 'symbol',
    'source': 'mvt',
    'source-layer': 'road_labels',
    'layout': {
      'text-size': 12,
      'symbol-placement': 'line',
      'text-field': ['get', 'label'],      
    },
    'paint': {
      'text-color': labelColor,
      'text-halo-color': '#fff',
      'text-halo-width': .5,
    }
  },  
]

export { getTileLayers } 
