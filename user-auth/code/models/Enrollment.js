const mongoose = require('mongoose')
const { Schema } = mongoose

// 用户
const EnrollmentSchema = new Schema({
  // 报名人
  user: {
    type: Schema.Types.ObjectId, ref: 'User'
  },

  // 活动代号
  activityAbbr: { type: String },
  // 报名信息
  infoData: { type: Object },
}, { timestamps: true })

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema)

module.exports = Enrollment