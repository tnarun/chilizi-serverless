const { getJsonBody, respJSON } = require('ben7th-fc-utils')
const UserStore = require('../lib/UserStore')
const EnrollmentStore = require('../lib/EnrollmentStore')

module.exports = [
  // 根据用户 token 创建报名信息
  ['/activity/enrollment/create', async ({ req, resp, route }) => {
    try {
      let { body } = await getJsonBody({ req, resp })
      let { authToken, infoData, activityAbbr } = body

      let user = await UserStore.verifyAuthToken(authToken)
      let enrollment = await EnrollmentStore.create({
        user: user.store, activityAbbr, infoData
      })

      return { enrollment }
    } catch (e) {
      return { error: e.message }
    }
  }],

  // 查找当前用户和对应活动的报名信息
  ['/activity/enrollment/list', async ({ req, resp, route }) => {
    try {
      let { body } = await getJsonBody({ req, resp })
      let { authToken, activityAbbr } = body

      let user = await UserStore.verifyAuthToken(authToken)
      let enrollments = await EnrollmentStore.byUserAndActivity({ 
        user: user.store, activityAbbr 
      })

      return { enrollments }
    } catch (e) {
      return { error: e.message }
    }
  }],

  // 根据条件查找报名信息
  ['/activity/enrollment/listByCondition', async ({ req, resp, route }) => {
    try {
      let { body } = await getJsonBody({ req, resp })
      let { condition } = body

      let enrollments = await EnrollmentStore.byCondition({ condition })

      return { enrollments }
    } catch (e) {
      return { error: e.message }
    }
  }],
]