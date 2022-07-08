const logger = require("./logger")
const mongoose = require("mongoose")

const Generation = require("./models/generation")
const Type = require("./models/type")
const Species = require("./models/species")
const Move = require("./models/move")
const MoveLearnedBySpecies = require("./models/moveLearnedBySpecies")

const { createGeneration }  = require("./seed/generationSeed")
const { createType, updateType }  = require("./seed/typeSeed")
const { createSpecies }  = require("./seed/speciesSeed")
const { createMove }  = require("./seed/moveSeed")
const { createMoveLearnedBySpecies }  = require("./seed/moveLearnedBySpeciesSeed")

module.exports.models = { 
  Generation, 
  Type, 
  Species, 
  Move, 
  MoveLearnedBySpecies 
}

module.exports.seeds = { 
  createGeneration, 
  createType, updateType, 
  createSpecies, 
  createMove, 
  createMoveLearnedBySpecies 
}

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

module.exports.getDBQueryMap = async(model, key) => {
  const query = await model.find({}).select(`${key} _id`)
  return query.reduce((acc, x) => { 
    acc[x[key]] = x._id
    return acc
  }, {})
}