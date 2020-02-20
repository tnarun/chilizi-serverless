const { graphql, buildSchema } = require('graphql')

const schema = buildSchema(`
  type Query {
    hello: [ String ]
    dice: Float
  }
`)

const root = {
  hello: () => {
    return [ 'Hello world!' ]
  },

  dice: () => {
    return Math.random()
  }
}

graphql(schema, '{ hello, dice }', root).then(res => {
  console.log(res)
})