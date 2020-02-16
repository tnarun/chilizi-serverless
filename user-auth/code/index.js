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