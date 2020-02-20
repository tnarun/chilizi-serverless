const { getJsonBody } = require('ben7th-fc-utils')
const UserStore = require('./UserStore')

const getList = async ({ req, resp, route }) => {
  let { queries } = req
  let { params } = route
  let { _sort, _order, _start, _end } = queries
  let users = await UserStore.getList({ _sort, _order, _start, _end })
  let totalCount = await UserStore.totalCount()
  let extraHeaders = [
    [ 'X-Total-Count', totalCount ]
  ]
  return { data: users, extraHeaders }
}

const getOne = async ({ req, resp, route }) => {
  let { queries } = req
  let { params } = route
  let { id } = params

  let user = await UserStore.getOne(id)
  return { data: user }
}

const create = async ({ req, resp, route }) => {
  let { body } = await getJsonBody({ req, resp })
  let { login, password } = body
  console.log({ login, password })
  let user = await UserStore.createByLoginAndPassword({ login, password })
  return { data: user.safeInfo }
} 

const update = async ({ req, resp, route }) => {
  let { params } = route
  let { id } = params

  let { body } = await getJsonBody({ req, resp })
  let { description } = body

  let user = await UserStore.update(id, { description })
  return { data: user }
} 

module.exports = {
  getList, getOne, create, update
}