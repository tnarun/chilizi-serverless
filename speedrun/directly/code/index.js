const Router = require('url-router')
const util = require('util')
const { getJsonBody, respJSON } = require('ben7th-fc-utils')

const fetch = require('node-fetch')

const router = new Router([
  // GET
  ['/(.*)', async ({ req, resp, route }) => {
    let { path, queries } = req
    
    let params = Object.keys(queries).map(key => {
      let value = queries[key]
      return `${key}=${value}`
    }).join('&')

    let apiPath = params ? `${path}?${params}` : path
    let reqUrl = `https://www.speedrun.com/api/v1${apiPath}`

    let res = await fetch(reqUrl)
    let data = await res.json()

    return data
  }],
])

module.exports.handler = (req, resp, context) => {
  // let params = {
  //   path: req.path,
  //   queries: req.queries,
  //   headers: req.headers,
  //   method : req.method,
  //   requestURI : req.url,
  //   clientIP : req.clientIP,
  // }

  let route = router.find(req.path)

  if (route) {
    route.handler({ req, resp, route })
      .then(data => respJSON(resp, data))
      .catch(e => {
         resp.setStatusCode(500)
         respJSON(resp, { error: util.inspect(e).split(`\n`) })
       })
    return
  }

  resp.setStatusCode(404)
  respJSON(resp, { error: 'no such API PATH', path: req.path })
}