const Enrollment = require('../models/Enrollment')
const { db } = require('ben7th-fc-utils')

class EnrollmentStore {
  constructor (store) {
    this.store = store
  }

  static async create ({ user, activityAbbr, infoData }) {  
    let data = { user, activityAbbr, infoData }

    let store
    await db.connectDB(async () => {
      store = await Enrollment.create(data)
    })
  
    return new EnrollmentStore(store)
  }

  static async byUserAndActivity ({ user, activityAbbr }) {
    let result
    await db.connectDB(async () => {
      result = await Enrollment.find({ user, activityAbbr })
    })
  
    return result
  }

  static async byCondition ({ condition }) {
    let result
    await db.connectDB(async () => {
      result = await Enrollment.find(condition)
    })
  
    return result
  }
}

module.exports = EnrollmentStore