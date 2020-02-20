require('./env')

const Router = require('url-router')
const util = require('util')
const { getJsonBody, respJSON } = require('ben7th-fc-utils')

const UserStore = require('./lib/UserStore')

const router = new Router([
  // 根据用户名和密码创建用户
  ['/createByLoginAndPassword', async ({ req, resp, route }) => {
    try {
      let { body } = await getJsonBody({ req, resp })
      let { login, password } = body
      let user = await UserStore.createByLoginAndPassword({ login, password })
      return { user: user.store }
    } catch (e) {
      return { error: e.message }
    }
  }],

  // 根据用户名和密码获得 authToken
  ['/auth/byLoginAndPassword', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { login, password } = body
    let user = await UserStore.getByLoginAndPassword({ login, password })
    return { token: user ? user.authToken : null }
  }],

  ['/getUserByAuthToken', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { authToken } = body
    let user = await UserStore.verifyAuthToken(authToken)
    return { user: user ? user.store : null }
  }],

  // privider funcs

  // getList
  // GET /json/users?_sort=title&_order=ASC&_start=0&_end=24&title=bar
  // provider 获取用户列表
  ['/json/users', async ({ req, resp, route }) => {
    let { queries } = req
    let { params } = route
    let { _sort, _order, _start, _end } = params
    let users = await UserStore.getList({ _sort, _order, _start, _end })
    let totalCount = await UserStore.totalCount()
    let extraHeaders = [
      [ 'X-Total-Count', totalCount ]
    ]
    return { data: users, extraHeaders }
  }]
])

module.exports.handler = (req, resp, context) => {
  let route = router.find(req.path)

  if (route) {
    route.handler({ req, resp, route })
      .then(data => {
        if (data.extraHeaders) {
          for (let h of data.extraHeaders) {
            resp.setHeader(h[0], `${h[1]}`)
          }
          resp.setHeader('Access-Control-Expose-Headers', 'Date,X-Fc-Request-Id,x-fc-error-type,x-fc-code-checksum,x-fc-invocation-duration,x-fc-max-memory-usage,x-fc-log-result,x-fc-invocation-code-version,X-Total-Count')
          resp.setHeader('content-type', 'application/json')
          resp.send(JSON.stringify(data.data))
        } else {
          resp.setHeader('content-type', 'application/json')
          resp.send(JSON.stringify({ data }))
        }
      })
      .catch(e => respJSON(resp, { error: util.inspect(e).split(`\n`) }))
    return
  }

  respJSON(resp, { error: 'no such API PATH', path: req.path })
}