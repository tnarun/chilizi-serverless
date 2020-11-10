const mongoose = require('mongoose')
const { Schema } = mongoose

// 用户
const UserSchema = new Schema({
  // 用户唯一登录名
  login: { type: String, 
    trim: true, index: true, unique: true, sparse: true }, 
  // 手机号
  phoneNumber: { type: String, 
    trim: true, index: true, unique: true, sparse: true }, 
  // 邮箱
  email: { type: String, 
    trim: true, index: true, unique: true, sparse: true }, 

  // 密码加密 salt
  passwordSalt: { type: String, select: false }, 
  // 密码加密后的密文
  passwordTicket: { type: String, select: false }, 

  // 用户昵称
  nickName: { type: String }, 
  // 用户简介
  description: { type: String },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User