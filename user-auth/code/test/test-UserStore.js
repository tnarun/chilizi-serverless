require('should')

const UserStore = require('../lib/UserStore')

describe ('UserStore', () => {
  it ('UserStore', () => {
    UserStore.should.not.be.null
  })

  it ('create', async () => {
    let name = 'ben7th'
    let password = '123456'
    let user = await UserStore.createByNamePass({ name, password })
    console.log(user)

    // exist
    user.should.be.ok()
    let data = user.data
    should(data.name).be.ok()

    // id
    should(data.id).be.ok()
    should(data.id).be.String()
    should(data.id.length).equal(24)

    // password
    should(data.password).not.be.ok()
    should(data.pass_ticket).be.ok()
    should(data.salt).be.ok()
    should(data.salt.length === 16).be.true()
    should(data.pass_ticket.length === 32).be.true()
  })

  it ('验证密码', async () => {
    let username = 'ben7th'
    let password = '123456'
    let user = await UserStore.createByNamePass({ username, password })

    should(user.checkPassword).be.ok()
    should(user.checkPassword('123456')).be.true()
    should(user.checkPassword('abcdef')).be.false()
  })
})