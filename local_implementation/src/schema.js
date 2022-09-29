const { permissions } = require('./permissions')
const { applyMiddleware } = require('graphql-middleware')

const { objectType, arg, nonNull, stringArg, intArg, inputObjectType, enumType,  asNexusMethod, makeSchema, subscriptionType} = require( 'nexus');
const path = require('path')
const crypto = require('crypto');
const { DateTimeResolver } = require('graphql-scalars')

const { pubsub } = require('./pubsub')

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createClient", {
      type: Client,
      args: {
        input: arg({ type: nonNull(ClientInput) }),
      },
      async resolve (_, args, context) {
        const newMessage = { 
          id: crypto.randomBytes(8).toString("hex"),
          content: "Creado nuevo WK"
        }
        await pubsub.publish('NEW_WK', { data: newMessage})
        return context.prisma.Client.create({
          data: {
            code:         crypto.randomUUID(),
            name:         args.input.name,
            description:  args.input.description,
            location:     args.input.location,
            organization: args.input.organization,
            businessType:     args.input.businessType,
          },
        })
      },
    })
    t.field("updateClient", {
      type: Client,
      args: {
        code: nonNull(stringArg()),
        input: arg({ type: nonNull(ClientInput) }),
      },
      resolve: (_, args, context) => {
        return context.prisma.Client.update({
          where: { code: args.code },
          data: {
            name:         args.input.name,
            description:  args.input.description,
            location:     args.input.location,
            organization: args.input.organization,
            businessType:     args.input.businessType,
          },
        })
      },
    })
    t.field("deleteClient", {
      type: Client,
      args: {
        code: nonNull(stringArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.Client.delete({
          where: { code: args.code },
        })
      },
    })
  }
})
const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("readClient", {
      type: Client,
      args: {
        code: nonNull(stringArg()),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.Client.findUnique({
          where: { code: args.code || undefined },
        })
      },
    })
    t.list.field("searchClients", {
      type: Client,
      args: {
        input: arg({ type: nonNull(SearchFilterInput) }),
        pageSize: intArg(),
        offset: intArg(),
      },
      resolve: (_parent, args, context) => {
        //console.log(context)
        return context.prisma.Client.findMany({
          take: args.pageSize,
          skip: args.offset,
          where: { 
            location: args.input.location || undefined,
            businessType: args.input.businessType || undefined,
            organization: args.input.organization || undefined
          }
        })
      },
    })
  }
})
const Client = objectType({
  name: "Client",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("code")
    t.nonNull.string("name")
    t.string("description")
    t.nonNull.string("location")
    t.string("organization")
    t.nonNull.field("businessType", { type: BusinessType })
    t.nonNull.date("createdAt")
    t.date("updatedAt")
  }
})

const SearchFilterInput = inputObjectType({
  name: "SearchFilterInput",
  definition(t) {
    t.string("location")
    t.string("organization")
    t.field("businessType", { type: BusinessType })
  }
});
const ClientInput = inputObjectType({
  name: "ClientInput",
  definition(t) {
    t.nonNull.string("name")
    t.string("description")
    t.nonNull.string("location")
    t.string("organization")
    t.nonNull.field("businessType", { type: BusinessType })
  }
});

const BusinessType = enumType({
  name: "BusinessType",
  members: ['UNDEFINED','AUTO','FINANCE','MANUFACTURING','PUBLIC'],
});


const Date = asNexusMethod(DateTimeResolver, 'date');

const Message = objectType({
  name: "Message",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("content")
  }
})

const Subscription = subscriptionType({
  name: "Subscription",
  definition(t) {
    t.field("messages", { 
      type: Message,
      subscribe() {
        return pubsub.asyncIterator('NEW_WK')
      },
      async resolve(eventPromise) {
            const event = await eventPromise
            return event.data
      }
    })
  },
})

const schemaWithoutPermissions = makeSchema({
    types: [Client, ClientInput, Query, Mutation, BusinessType, Date, SearchFilterInput],
    outputs: {
      schema: path.join(__dirname, '../schema.graphql'),
      typegen: path.join(__dirname, '/generated/nexus.ts'),
    },
    contextType: {
      module: require.resolve('./context'),
      export: 'context',
    },
    sourceTypes: {
      modules: [
        {
          module: '@prisma/client',
          alias: 'prisma',
        },
      ],
    },
  })
  

const schema = applyMiddleware(schemaWithoutPermissions, permissions)

module.exports = {
      schema: schema,
    }
