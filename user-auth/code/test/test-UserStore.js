require('./env')
require('should')

const { db } = require('ben7th-fc-utils')
const UserStore = require('../lib/UserStore')

describe('UserStore', () => {
  it('UserStore', () => {
    should(UserStore).not.be.null
  })

  describe('createByNamePass', async () => {
    before(async () => {
      await UserStore.__clear()

      let login = 'ben7th'
      let password = '123456'
      await UserStore.createByLoginAndPassword({ login, password })
    })

    it('exist', async () => {
      let login = 'ben7th'
      let user = await UserStore.getByLogin(login)
      user.should.be.ok()
      let store = user.store
      should(store.login).be.ok()
    })

    it('id', async () => {
      let login = 'ben7th'
      let user = await UserStore.getByLogin(login)
      user.should.be.ok()
      let store = user.store
      should(store.id).be.ok()
      should(store.id).be.String()
      should(store.id.length).equal(24)
    })

    it('password', async () => {
      let login = 'ben7th'
      let user = await UserStore.getByLogin(login)
      user.should.be.ok()
      let store = user.store
      should(store.password).not.ok()
      should(store.passwordTicket).ok()
      should(store.passwordSalt).ok()
      should(store.passwordSalt.length).equal(16)
      should(store.passwordTicket.length).equal(32)
    })

    it ('验证密码 checkPassword', async () => {
      let login = 'ben7th'
      let user = await UserStore.getByLogin(login)

      should(user.checkPassword).ok()
      should(user.checkPassword('123456')).true()
      should(user.checkPassword('abcdef')).false()
    })

    it ('根据 login 和密码获得用户记录', async () => {
      let user1 = await UserStore.getByLoginAndPassword({ login: 'ben7th', password: '123456' })
      let user2 = await UserStore.getByLoginAndPassword({ login: 'ben7th', password: '654321' })
      should(user1).ok()
      should(user2).null()
    })
  })
})