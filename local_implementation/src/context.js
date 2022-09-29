const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function createContext(req) {
  const request = {...req}
  const userId = request.req.get('Host')

  return {
    userId,
    prisma,
  }
}

module.exports = {
  createContext: createContext,
}