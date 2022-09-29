const { rule, shield } = require('graphql-shield')

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context) => {
    //console.log(`COGNITO group:${context.user.userGroup}`)
    if(context.user.userGroup=="[admins]")
         return true
    else console.log("AUTH ERROR: user does not belongs to admins group") 
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