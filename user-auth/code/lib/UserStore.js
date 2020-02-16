const md5 = require('./md5')
const User = require('../models/User')
const { db } = require('ben7th-fc-utils')
const jwt = require('jsonwebtoken')

const genPassTicket = (password) => {
  let passwordSalt = md5.randstr()
  let passwordTicket = md5.addSalt({ password, salt: passwordSalt })
  return { passwordSalt, passwordTicket }
}

class UserStore {
  constructor (store) {
    this.store = store
  }

  static async __clear () {
    await db.connectDB(async () => {
      await User.deleteMany({ })
    })
  } 

  static async createByLoginAndPassword ({ login, password }) {
    let { passwordSalt, passwordTicket } = genPassTicket(password)
  
    let data = { 
      login, 
      passwordSalt, passwordTicket
    }

    let store
    await db.connectDB(async () => {
      store = await User.create(data)
    })
  
    return new UserStore(store)
  }

  static async getByLogin (login) {
    let store
    await db.connectDB(async () => {
      store = await User.findOne({ login })
    })
    return new UserStore(store)
  }

  static async getByLoginAndPassword ({ login, password }) {
    let user = await UserStore.getByLogin(login)
    if (user.checkPassword(password)) {
      return user
    }
    return null
  }

  static async getAuthToken ({ login, password }) {
    let user = await UserStore.getByLoginAndPassword({ login, password })
    if (user) {
      return user.authToken
    }
    return null
  }

  static async verifyAuthToken (token) {
    let { JWT_SECRET } = process.env
    let data = jwt.verify(token, JWT_SECRET)
    if (data && data.id) {
      let store
      await db.connectDB(async () => {
        store = await User.findById(data.id)
      })
      return new UserStore(store)
    }
    return null
  }

  get authToken () {
    let { _id } = this.store
    let { JWT_SECRET } = process.env
    let token = jwt.sign({ id: _id }, JWT_SECRET, { expiresIn: '24h' })
    return token
  }

  get safeInfo () {
    let { _id, login, createdAt, updatedAt } = this.store
    return { id: _id, login, createdAt, updatedAt }
  }

  checkPassword (password) {
    let { passwordSalt, passwordTicket } = this.store
    return md5.addSalt({ password, salt: passwordSalt }) === passwordTicket
  }
}

module.exports = UserStore