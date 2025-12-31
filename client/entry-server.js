import { createApp } from './app.js'
import { renderToString } from 'vue/server-renderer'

export async function renderAppHtml() {

  const { app } = createApp()

  const appHtml = await renderToString(app)

  return appHtml
}

