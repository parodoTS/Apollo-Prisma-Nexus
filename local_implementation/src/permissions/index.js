const { rule, shield } = require('graphql-shield')

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context) => {
    if(context.userId=="localhost:4000")
        return true
    else console.log("Error con el host") 
    return false
  })
}

const permissions = shield({
  Query: {
    readClient: rules.isAuthenticatedUser,
    searchClients: rules.isAuthenticatedUser,
  },
  Mutation: {
    createClient: rules.isAuthenticatedUser,
    updateClient: rules.isAuthenticatedUser,
    deleteClient: rules.isAuthenticatedUser,
  },
})

module.exports = {
  permissions: permissions,
}