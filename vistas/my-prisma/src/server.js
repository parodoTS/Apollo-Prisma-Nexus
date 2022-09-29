const { ApolloServer, gql } = require('apollo-server-lambda');
const { schema } = require('./schema')
const { createContext } = require('./context')


const server = new ApolloServer({
  schema: schema,
  context: async ({ event, context, express }) => (await createContext(event))
})

exports.graphqlHandler = server.createHandler()