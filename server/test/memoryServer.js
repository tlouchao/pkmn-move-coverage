const logger = require("../src/logger")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

const server = new MongoMemoryServer()

module.exports.connectDB = async() => {
  await server.start()
  const uri = server.getUri()
  await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      logger.debug('Connected to in-memory database')
      return mongoose.connection
    })
    .catch(err => {
      logger.error(`Error connecting to the in-memory database. \n${err}`)
    })
}

module.exports.clearDB = async() => {
  const collections = mongoose.connection.collections
  for (const k in collections){
    const v = collections[k]
    await v.deleteMany()
    logger.debug('Cleared in-memory database')
  }
}

module.exports.closeDB = async() => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
    .then(() => {
      logger.debug('Closed connection')
    })
    .catch(err => {
      logger.error(`Error closing connection. \n${err}`)
    })

  await server.stop()
}