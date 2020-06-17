require('./env')

const Router = require('url-router')
const util = require('util')
const { getJsonBody, respJSON } = require('ben7th-fc-utils')

const UserStore = require('./lib/UserStore')

const router = new Router([
  // 2020-06-18 暂时不用
  // // 根据用户名和密码创建用户
  // ['/createByLoginAndPassword', async ({ req, resp, route }) => {
  //   try {
  //     let { body } = await getJsonBody({ req, resp })
  //     let { login, password } = body
  //     let user = await UserStore.createByLoginAndPassword({ login, password })
  //     return { user: user.store }
  //   } catch (e) {
  //     return { error: e.message }
  //   }
  // }],

  // // 根据用户名和密码获得 authToken
  // ['/auth/byLoginAndPassword', async ({ req, resp, route }) => {
  //   let { body } = await getJsonBody({ req, resp })
  //   let { login, password } = body
  //   let user = await UserStore.getByLoginAndPassword({ login, password })
  //   return { token: user ? user.authToken : null }
  // }],

  // 根据手机号和密码创建用户，并添加昵称
  ['/createByPhoneAndPassword', async ({ req, resp, route }) => {
    try {
      let { body } = await getJsonBody({ req, resp })
      let { phoneNumber, password, nickName } = body
      let user = await UserStore.createByPhoneAndPassword({ 
        phoneNumber, password, nickName
      })
      return { user: user.safeData }
    } catch (e) {
      return { error: e.message }
    }
  }],

  // 根据手机号和密码获得 authToken
  ['/auth/byPhoneAndPassword', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { phoneNumber, password } = body
    let user = await UserStore.getByPhoneAndPassword({ phoneNumber, password })
    if (user) {
      return { user: user.safeData }
    }
    return { user: null }
  }],

  // 根据 token 查找用户
  ['/getUserByAuthToken', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { authToken } = body
    let user = await UserStore.verifyAuthToken(authToken)
    return { user: user ? user.store : null }
  }]
])

module.exports.handler = (req, resp, context) => {
  let route = router.find(req.path)

  if (route) {
    route.handler({ req, resp, route })
      .then(data => respJSON(resp, { data }))
      .catch(e => {
         resp.setStatusCode(500)
         respJSON(resp, { error: util.inspect(e).split(`\n`) })
       })
    return
  }

  resp.setStatusCode(404)
  respJSON(resp, { error: 'no such API PATH', path: req.path })
}