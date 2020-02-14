const Router = require('url-router')
const util = require('util')
const { getJsonBody, respJSON } = require('ben7th-fc-utils')

const router = new Router([
  // 根据用户名和密码创建用户
  ['/create', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { username, password } = body
    return { body }
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
      .then(data => respJSON(resp, { data }))
      .catch(e => respJSON(resp, { error: util.inspect(e).split(`\n`) }))
    return
  }

  respJSON(resp, { error: 'no such API PATH', path: req.path })
}