const crypto = require('crypto')

const digest = (string) => {
  return crypto.createHash('md5').update(string).digest('hex')
}

const addSalt = ({ password, salt }) => {
  let ticket = digest(digest(digest(password) + salt) + 'charlene')
  return ticket
}

const randstr = (len = 16) => {
  let s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let re = ''
  for (let i = 0; i < len; i ++) {
    let idx = ~~(Math.random() * s.length)
    re = `${re}${s[idx]}`
  }
  return re
}

module.exports = {
  digest,
  addSalt,
  randstr
}