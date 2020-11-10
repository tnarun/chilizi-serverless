const { getJsonBody, respJSON } = require('ben7th-fc-utils')
const SpeedrunRecordStore = require('../lib/SpeedrunRecordStore')

module.exports = [
  // 匿名提交速通成绩
  ['/submitSpeedrunRecord', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { recordData } = body
    let speedrunRecord = await SpeedrunRecordStore.create({ recordData })
    return { speedrunRecord: speedrunRecord.store }
  }],

  // 根据 sid 查找成绩
  ['/record/getBySid', async ({ req, resp, route }) => {
    let { body } = await getJsonBody({ req, resp })
    let { sid } = body
    let speedrunRecord = await SpeedrunRecordStore.getBySid({ sid })
    return { speedrunRecord: speedrunRecord.store }
  }]
]