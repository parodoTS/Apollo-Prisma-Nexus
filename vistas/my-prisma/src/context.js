const { PrismaClient } = require('./generated/client')//('@prisma/client')
const { SecretsManager } = require('aws-sdk')

const sm = new SecretsManager()

let db

async function getDB() {
  if (db) return db

  const dbURL = await sm.getSecretValue({SecretId: process.env.SECRET_ARN || '',}).promise()

  const secretString = JSON.parse(dbURL.SecretString || '{}')
  const dburl = `postgresql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=1`

  db = new PrismaClient({ datasources: { db: { url: dburl} } })
  
  //console.log(db)
  
  return db
}

async function createContext(req) {
  const request = {...req}
  const username = request.requestContext.authorizer.jwt.claims['cognito:username']
  const userGroup = request.requestContext.authorizer.jwt.claims['cognito:groups']

  // console.log(username)
  // console.log(userGroup)

  return {
    user:{
      username: username,
      userGroup: userGroup
    },
    prisma: await getDB(),
  }
}

module.exports = {
  createContext: createContext,
}

