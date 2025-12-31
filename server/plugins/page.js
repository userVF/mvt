import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { join } from 'desm'

import { renderAppHtml } from '../../build/server/entry-server.js'

const rawHtmlPath = resolve(join(import.meta.url, '..', '..', 'build/client/html/index.html'))
const rawHtml = await fs.readFile(rawHtmlPath, { encoding: 'utf8' })

export default function(app, _opts, done) {  

  app.decorate('renderPage', async () => {

    const appHtml = await renderAppHtml() 
    
    let html = rawHtml
      .replace('!--csp--', 
        `<meta http-equiv="Content-Security-Policy" 
          content="default-src 'self' ${process.env.VITE_STATIC_ORIGIN} *.maplibre.org data: ;
          script-src ${process.env.VITE_STATIC_ORIGIN} ;
          style-src ${process.env.VITE_STATIC_ORIGIN} ;
          img-src data: blob: ${process.env.VITE_STATIC_ORIGIN} ;
          child-src blob: ;
          worker-src blob: ;"
        >`
      )           
			.replace('!--html--', appHtml)

    return html
    
  })

  app.get('/', async (_request, reply) => {
    reply.type('text/html') 
    return await app.renderPage()
  })

  done()

}