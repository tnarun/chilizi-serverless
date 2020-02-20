require('./env')

const Router = require('url-router')
const util = require('util')
const { getJsonBody, respJSON } = require('ben7th-fc-utils')

const UserProvider = require('./lib/UserProvider')

const router = new Router([
  // privider funcs

  ['/json/users', async ({ req, resp, route }) => {
    let { method } = req
    
    // getList
    // GET /json/users?_sort=title&_order=ASC&_start=0&_end=24&title=bar
    // provider 获取用户列表
    if (method === 'GET') {
      return await UserProvider.getList({ req, resp, route })
    }

    // create
    // POST /json/users/123
    // provider 创建用户
    if (method === 'POST') {
      return await UserProvider.create({ req, resp, route })
    }
  }],

  ['/json/users/:id', async ({ req, resp, route }) => {
    let { method } = req

    // getOne
    // getMany
    // GET /json/users/123
    // provider 获取用户信息
    if (method === 'GET') {
      return await UserProvider.getOne({ req, resp, route })
    }
    if (method === 'PUT') {
      return await UserProvider.update({ req, resp, route })
    }
  }],
])

module.exports.handler = (req, resp, context) => {
  let route = router.find(req.path)

  if (route) {
    route.handler({ req, resp, route })
      .then(({ data, extraHeaders = []}) => {
        for (let h of extraHeaders) {
          resp.setHeader(h[0], `${h[1]}`)
        }
        resp.setHeader('Access-Control-Expose-Headers', 'Date,X-Fc-Request-Id,x-fc-error-type,x-fc-code-checksum,x-fc-invocation-duration,x-fc-max-memory-usage,x-fc-log-result,x-fc-invocation-code-version,X-Total-Count')
        resp.setHeader('content-type', 'application/json')
        resp.send(JSON.stringify(data))
      })
      .catch(e => {
        resp.setStatusCode(500)
        respJSON(resp, { error: util.inspect(e).split(`\n`) })
      })
    return
  }

  resp.setStatusCode(404)
  respJSON(resp, { error: 'no such API PATH', path: req.path })
}