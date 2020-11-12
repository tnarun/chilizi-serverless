const mongoose = require('mongoose')
const { Schema } = mongoose

// 速通成绩
const SpeedrunRecordSchema = new Schema({
  // 短 id, 用于组织 url
  sid: { type: String },
  // 游戏缩写，用于查询
  gameAbbr: { type: String },

  // 成绩原始数据
  recordRawData: { type: Object },

  // 审核状态
  // wait - 等待
  // reject - 拒绝
  // approve - 批准
  // dispute - 争议
  verifyStatus: { type: String, default: 'wait' }, 

  userId: { type: String }
}, { timestamps: true })

const SpeedrunRecord = mongoose.model('SpeedrunRecord', SpeedrunRecordSchema)

module.exports = SpeedrunRecord