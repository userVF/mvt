import { createSSRApp } from 'vue'

import App from './App.vue'

export function createApp() {
  
  const app = createSSRApp(App)

  app.config.errorHandler = (err, instance, info) => {
    console.log('vue app.errorHandler ', err, instance, info)
  }

  return app
}