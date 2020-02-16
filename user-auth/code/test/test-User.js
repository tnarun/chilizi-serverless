require('./env')
require('should')

const User = require('../models/User')
const { db } = require('ben7th-fc-utils')
const mongoose = require('mongoose')

describe('test db', () => {
  before(async () => {
    await db.onlyConnect()
  })

  after(async () => {
    await db.onlyClose()
  })

  it('mongoose', async () => {
    let users = await User.find({})
    should(users.length).be.Number()
    should(mongoose).be.ok()
  })
})

describe('test User', () => {
  before(async () => {
    await db.onlyConnect()
    await User.deleteMany({ })
  })

  after(async () => {
    await db.onlyClose()
  })

  it('create User', async () => {
    let user = await User.create({ login: 'ben7th' })

    should(user).be.ok()
    should(user.login).be.equal('ben7th')

    should(user.createdAt).be.ok()
    should(user.updatedAt).be.ok()
  })

  it('create dup login User', async () => {
    let user1
    let user2
    try {
      user1 = await User.create({ login: 'tom' })
      user2 = await User.create({ login: 'tom' })
    } catch (e) {}
    should(user1).be.ok()
    should(user2).be.not.ok()
  })

  it('create dup phoneNumber', async () => {
    let user1
    let user2
    let user3
    try {
      user1 = await User.create({ login: 'jerry1', phoneNumber: '13800000000' })
      user2 = await User.create({ login: 'jerry2', phoneNumber: '13800000000' })
    } catch (e) {}
    try {
      user3 = await User.create({ login: 'jerry2', phoneNumber: '13800000001' })
    } catch (e) {}
    should(user1).be.ok()
    should(user2).be.not.ok()
    should(user3).be.ok()
  })
})