require('./env')
require('should')

const { db } = require('ben7th-fc-utils')
const UserStore = require('../lib/UserStore')

describe('UserStore', () => {
  before(async () => {
    await UserStore.__clear()

    await UserStore.createByLoginAndPassword({ login: 'ben7th1', password: '123456' })
    await UserStore.createByLoginAndPassword({ login: 'ben7th2', password: '123456' })
    await UserStore.createByLoginAndPassword({ login: 'ben7th3', password: '123456' })
    await UserStore.createByLoginAndPassword({ login: 'ben7th4', password: '123456' })
  })

  it('UserStore', () => {
    should(UserStore).not.be.null
  })

  it('getList', async () => {
    let users = await UserStore.getList()
    // console.log(users)
    should(users.length > 0).be.true()
  })

  it('totalCount', async () => {
    let count = await UserStore.totalCount()
    should(count).equal(4)
  })

  it('getOne', async () => {
    let user = await UserStore.createByLoginAndPassword({ login: 'slime', password: '123456' })
    let id = user.store.id
    should(id).be.ok()
    let user1 = await UserStore.getOne(id)
    should(user1.id).be.ok()
    should(user1.id).be.equal(id)
  })

  it('update', async () => {
    let user = await UserStore.createByLoginAndPassword({ login: 'duck', password: '123456' })
    let id = user.store.id
    should(id).be.ok()
    should(UserStore.update).be.ok()
    should(user.store.description).be.not.ok()
    await UserStore.update(id, { description: '好的鸭' })
    let user1 = await UserStore.getOne(id)
    should(user1.id).be.ok()
    should(user1.id).be.equal(id)
    should(user1.description).be.equal('好的鸭')
  })
})