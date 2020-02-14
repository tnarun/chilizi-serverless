require('should')

const md5 = require('../lib/md5')

describe ('UserStore', () => {
  it ('md5', () => {
    should(md5).be.ok()
    should(md5.addSalt).be.ok()
  })

  it ('digest', () => {
    should(md5.digest('a')).be.equal('0cc175b9c0f1b6a831c399e269772661')
    should(md5.digest('b')).be.equal('92eb5ffee6ae2fec3ad71c777531578f')
    should(md5.digest('ben7th')).be.equal('6b79bbded361637bd0b82aeec6401d57')
  })

  it ('addSalt', () => {
    let password = 'abcdef'
    let salt = '1q2w3e'
    let ticket = md5.addSalt({ password, salt })
    console.log({ ticket })
    should(ticket).be.ok()
    should(ticket).be.String()
    should(ticket.length).be.equal(32)
  })

  it ('randstr', () => {
    let str = md5.randstr()
    console.log(str)
    should(str.length).be.equal(16)
  })
})