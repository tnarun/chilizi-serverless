const ObjectID = require('mongodb').ObjectID
const md5 = require('./md5')

class UserStore {
  constructor (data) {
    this.data = data
  }

  checkPassword (password) {
    let { salt, pass_ticket } = this.data
    return md5.addSalt({ password, salt }) === pass_ticket
  }
}

UserStore.createByNamePass = ({ name, password }) => {
  let id = new ObjectID().toHexString()
  let salt = md5.randstr()
  let pass_ticket = md5.addSalt({ password, salt })

  let data = { 
    id, 
    name, 
    salt,
    pass_ticket,
  }

  return new UserStore(data)
}

module.exports = UserStore