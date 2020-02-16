const mongoose = require('mongoose')

// 用户
const UserSchema = new mongoose.Schema({
  // 用户唯一登录名
  login: { type: String, 
    trim: true, index: true, unique: true, sparse: true }, 
  // 手机号
  phoneNumber: { type: String, 
    trim: true, index: true, unique: true, sparse: true }, 
  // 邮箱
  email: { type: String, 
    trim: true, index: true, unique: true, sparse: true }, 

  // 用户昵称
  nickName: { type: String }, 

  // 密码加密 salt
  passwordSalt: { type: String }, 
  // 密码加密后的密文
  passwordTicket: { type: String }, 
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User