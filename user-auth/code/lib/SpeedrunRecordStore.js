const SpeedrunRecord = require('../models/SpeedrunRecord')
const { db } = require('ben7th-fc-utils')

const str = 
  "abcdefghijklmnopqrstuvwxyz" +
  // "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789"

const genId = () => {
  let len = 6
  let res = ""

  let idx0 = Math.floor(Math.random() * (str.length - 10))
  let c0 = str[idx0]
  res = `${res}${c0}`

  for (let i = 0; i < len - 1; i ++) {
    let idx = Math.floor(Math.random() * str.length)
    let c = str[idx]
    res = `${res}${c}`
  }

  return res
}

class SpeedrunRecordStore {
  constructor (store) {
    this.store = store
  }

  static async create ({ recordData }) {  
    let store
    let sid = genId()
    let gameAbbr = recordData.gameData.abbr

    await db.connectDB(async () => {
      store = await SpeedrunRecord.create({ 
        recordRawData: recordData, 
        sid, gameAbbr
      })
    })
  
    return new SpeedrunRecordStore(store)
  }

  // 根据 sid 查找成绩
  static async getBySid ({ sid }) {
    let store
    await db.connectDB(async () => {
      store = await SpeedrunRecord
        .findOne({ sid })
    })
    if (!store) {
      return null
    }
    return new SpeedrunRecordStore(store)
  }
}

module.exports = SpeedrunRecordStore