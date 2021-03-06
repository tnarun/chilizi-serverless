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

  get safeData () {
    let { _id, 
      login, phoneNumber, email, 
      nickName, description,
      createdAt, updatedAt 
    } = this.store

    let { authToken } = this

    return { _id, 
      authToken, 
      login, phoneNumber, email, 
      nickName, description,
      createdAt, updatedAt 
    }
  }

  get safeInfo () {
    let { _id, 
      login, 
      nickName, description,
      createdAt, updatedAt 
    } = this.store

    return { id: _id, _id, 
      login, 
      nickName, description,
      createdAt, updatedAt 
    }
  }

  static async __clear () {
    await db.connectDB(async () => {
      await User.deleteMany({ })
    })
  } 

  // 根据 login 和密码创建用户
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

  // 根据手机号和密码创建用户
  static async createByPhoneAndPassword ({ phoneNumber, password, nickName }) {
    let { passwordSalt, passwordTicket } = genPassTicket(password)
  
    let data = { 
      phoneNumber, 
      nickName,
      passwordSalt, passwordTicket
    }

    let store
    await db.connectDB(async () => {
      store = await User.create(data)
    })
  
    return new UserStore(store)
  }

  // 根据手机号或邮箱创建用户
  // 2020.11.11 ben7th
  static async createByPassword ({ phoneNumber, email, password, nickName }) {
    let { passwordSalt, passwordTicket } = genPassTicket(password)
    
    let data = { 
      phoneNumber, email, password, nickName,
      passwordSalt, passwordTicket
    }

    let store
    await db.connectDB(async () => {
      store = await User.create(data)
    })

    return new UserStore(store)
  }

  // 根据 login 查找用户
  static async getByLogin (login) {
    let store
    await db.connectDB(async () => {
      store = await User.findOne({ login }).select('+passwordSalt +passwordTicket')
    })
    if (!store) {
      return null
    }
    return new UserStore(store)
  }

  // 根据手机号查找用户
  static async getByPhoneNumber (phoneNumber) {
    let store
    await db.connectDB(async () => {
      store = await User.findOne({ phoneNumber }).select('+passwordSalt +passwordTicket')
    })
    if (!store) {
      return null
    }
    return new UserStore(store)
  }

  // 根据 login 或手机号或邮箱查找用户
  // 2020.11.11
  static async getByAny ({ login, phoneNumber, email }) {
    let s1, s2, s3
    await db.connectDB(async () => {
      if (login) {
        s1 = await User.findOne({ login }).select('+passwordSalt +passwordTicket')
      }
      if (phoneNumber) {
        s2 = await User.findOne({ phoneNumber }).select('+passwordSalt +passwordTicket')
      }
      if (email) {
        s3 = await User.findOne({ email }).select('+passwordSalt +passwordTicket')
      }
    })
    let store = s1 || s2 || s3
    if (!store) {
      return null
    }
    return new UserStore(store)
  }

  // 根据 login 和密码查找用户
  static async getByLoginAndPassword ({ login, password }) {
    let user = await UserStore.getByLogin(login)
    if (!user) {
      return null
    }
    if (user.checkPassword(password)) {
      return user
    }
    return null
  }

  // 根据手机号和密码查找用户
  static async getByPhoneAndPassword ({ phoneNumber, password }) {
    let user = await UserStore.getByPhoneNumber(phoneNumber)
    if (!user) {
      return null
    }
    if (user.checkPassword(password)) {
      return user
    }
    return null
  }

  // 根据手机号或邮箱和密码查找用户
  // 2020.11.11
  static async getByPassword ({ phoneNumber, email, password }) {
    let user = await UserStore.getByAny({ login: null, phoneNumber, email })
    if (!user) {
      return null
    }
    if (user.checkPassword(password)) {
      return user
    }
    return null
  }

  // 根据 login 和密码获取 token
  static async getAuthToken ({ login, password }) {
    let user = await UserStore.getByLoginAndPassword({ login, password })
    if (user) {
      return user.authToken
    }
    return null
  }

  // 根据手机号和密码获取 token
  static async getAuthTokenByPhone ({ phoneNumber, password }) {
    let user = await UserStore.getByPhoneAndPassword({ phoneNumber, password })
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

  checkPassword (password) {
    let { passwordSalt, passwordTicket } = this.store
    return md5.addSalt({ password, salt: passwordSalt }) === passwordTicket
  }

  async updateNickName ({ nickName }) {
    await db.connectDB(async () => {
      this.store.nickName = nickName
      await this.store.save()
    })
  } 
}

// provider 

UserStore.getList = async () => {
  let users
  await db.connectDB(async () => {
    users = await User.find({})
  })
  return users.map(x => {
    return new UserStore(x).safeInfo
  })
}

UserStore.totalCount = async () => {
  let count
  await db.connectDB(async () => {
    count = await User.countDocuments({})
  })
  return count
}

UserStore.getOne = async (id) => {
  let user
  await db.connectDB(async () => {
    user = await User.findById(id)
  })
  return new UserStore(user).safeInfo
}

UserStore.update = async (id, data) => {
  let { description } = data
  let user
  await db.connectDB(async () => {
    await User.updateOne({ _id: id }, { description })
    user = await User.findById(id)
  })
  return new UserStore(user).safeInfo
}

module.exports = UserStore