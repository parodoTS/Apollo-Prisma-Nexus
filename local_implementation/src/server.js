const { ApolloServer } = require('apollo-server-express') //require('apollo-server-lambda');
const { schema } = require('./schema')
const { createContext } = require('./context')
const express = require('express')
const HTTP = require('http')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { WebSocketServer } = require ('ws');
const { useServer } = require ('graphql-ws/lib/use/ws');


/* const server = new ApolloServer({
  schema: schema,
  context: createContext,
})

const app = express()
const http = HTTP.createServer(app)

server.applyMiddleware({ app, path: '/' })
server.installSubscriptionHandlers(http)

http.listen().then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
  `);
}) */


async function startApolloServer() {
  const app = express();
  const httpServer = HTTP.createServer(app);

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: schema,
    context: createContext,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:4000${server.graphqlPath}`);
}

startApolloServer()

//exports.graphqlHandler = server.createHandler();
