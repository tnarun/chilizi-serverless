require('./env')
// require('./env-test') // 部署前注释掉

const Router = require('url-router')
const util = require('util')
const { respJSON } = require('ben7th-fc-utils')

const ModuleActivityEnroll = require('./modules/activity-enroll')
const ModuleSpeedrunRecord = require('./modules/speedrun-record')
const ModuleUserAuth = require('./modules/user-auth')
const ModuleUserAuthV2 = require('./modules/user-auth-v2')

const apis = []
  .concat(ModuleUserAuth)
  .concat(ModuleActivityEnroll)
  .concat(ModuleSpeedrunRecord)
  .concat(ModuleUserAuthV2)

const router = new Router(apis)

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