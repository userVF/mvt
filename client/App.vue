<template>

  <div id="map"></div>
  
</template>

<script setup>

  import { onMounted } from 'vue'

  const tileSetName = 'map1'

  onMounted(async () => {
    if(!import.meta.env.SSR) {
      try {
        const { createMap } = await import('./map')
        createMap(tileSetName)
      } catch (err) {
        console.log(`createMap import error: ${err}`)
      }
    }
  })

</script>