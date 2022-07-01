const logger = require("./logger")
const mongoose = require("mongoose")

module.exports.connectDB = async() => {
  await mongoose.connect(process.env.ATLAS_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    logger.info('Connected to database')
    return mongoose.connection
  })
  .catch(err => {
    logger.error(`Error connecting to the database. \n${err}`)
  })
}

module.exports.closeDB = async() => {
  await mongoose.connection.close()
  .then(() => {
    logger.info('Closed connection')
  })
  .catch(err => {
    logger.error(`Error closing connection. \n${err}`)
  })
}