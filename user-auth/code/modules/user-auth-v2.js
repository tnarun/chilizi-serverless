const { getJsonBody } = require('ben7th-fc-utils')
const UserStore = require('../lib/UserStore')

module.exports = [
  // 根据表单信息注册用户
  // 手机号或邮箱
  ['/v2/user/create', async ({ req, resp, route }) => {
    try {
      let { body } = await getJsonBody({ req, resp })
      let { phoneNumber, email, password, nickName } = body
      let user = await UserStore.createByPassword({ 
        phoneNumber, email, password, nickName
      })
      return { user: user.safeData }
    } catch (e) {
      return { error: e.message }
    }
  }],

  // 登录，也就是获取用户 token
  // 根据手机号或邮箱
  ['/v2/user/authByPw', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { phoneNumber, email, password } = body
    let user = await UserStore.getByPassword({ phoneNumber, email, password })
    if (user) {
      return { user: user.safeData }
    }
    return { user: null }
  }],

  // 根据 token 查找用户
  ['/v2/user/getByToken', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { authToken } = body
    let user = await UserStore.verifyAuthToken(authToken)
    if (user) {
      return { user: user.safeData }
    }
    return { user: null }
  }],

  // 修改用户昵称
  ['/v2/user/updateNickName', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { authToken, nickName } = body
    let user = await UserStore.verifyAuthToken(authToken)
    if (user) {
      await user.updateNickName({ nickName })
      return { user: user.safeData }
    }
    return { user: null }
  }],

  // 根据 ID 获取用户信息
  ['/v2/user/getById', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { id } = body
    let user = await UserStore.getOne(id)
    return user
  }]
]