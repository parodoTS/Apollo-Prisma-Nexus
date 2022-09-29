const { permissions } = require('./permissions')
const { initMSK, sendMessage } = require('./msk/producer')

const { applyMiddleware } = require('graphql-middleware')

const { objectType, arg, nonNull, stringArg, intArg, inputObjectType, enumType,  asNexusMethod, makeSchema, } = require( 'nexus');
const path = require('path')
const crypto = require('crypto');
const { DateTimeResolver } = require('graphql-scalars')


const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createClient", {
      type: Client,
      args: {
        input: arg({ type: nonNull(ClientInput) }),
      },
      async resolve (_, args, context) {
        const createdUser = await context.prisma.Client.create({
          data:{
            code:             crypto.randomUUID(),
            name:             args.input.name,
            description:      args.input.description,
            location:         args.input.location,
            organization:     args.input.organization,
            businessType:     args.input.businessType,
          },
        })
        await sendMessage("create",JSON.stringify(createdUser))
        return createdUser
      },
    })
    t.field("updateClient", {
      type: Client,
      args: {
        code: nonNull(stringArg()),
        input: arg({ type: nonNull(ClientInput) }),
      },
      async resolve (_, args, context) {
        const updatedUser = context.prisma.Client.update({
          where: { code: args.code },
          data: {
            name:             args.input.name,
            description:      args.input.description,
            location:         args.input.location,
            organization:     args.input.organization,
            businessType:     args.input.businessType,
          },
        })
        await sendMessage("update",JSON.stringify(args))
        return updatedUser
      },
    })
    t.field("deleteClient", {
      type: Client,
      args: {
        code: nonNull(stringArg()),
      },
      async resolve (_, args, context) {
        const deletedUser = context.prisma.Client.delete({
          where: { code: args.code },
        })
        await sendMessage("delete",JSON.stringify(args))
        return deletedUser
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
            location:     args.input.location || undefined,
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

const schemaWithoutPermissions = makeSchema({
    shouldGenerateArtifacts: false,//process.env.NODE_ENV === 'development',
    types: [Client, ClientInput, Query, Mutation, BusinessType, Date, SearchFilterInput],
    outputs: {
      schema: path.join(__dirname, '../schema.graphql'),
      typegen: path.join(__dirname, '/generated/nexus.ts'),
    },
    // contextType: {
    //   module: path.join(__dirname,'./context'),
    //   export: 'context',
    // },
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
