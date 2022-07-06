'use strict'
const { createMoveLearnedBySpecies }  = require("../seed/moveLearnedBySpeciesSeed")
const { createMove }  = require("../seed/moveSeed")
const { createSpecies }  = require("../seed/speciesSeed")
const { createGeneration }  = require("../seed/generationSeed")
const { createType, updateType }  = require("../seed/typeSeed")

const { connectDB, closeDB } = require("../db")
const logger = require("../logger")

const baseURL = "https://pokeapi.co/api/v2"
const generationURL = "/generation"
const typeURL = "/type"
const moveURL = "/move"
const dexURL = "/pokedex/1"

const axios = require('axios')
axios.defaults.baseURL = baseURL

module.exports.initial = function() {
  return axios.get(generationURL)
    .then(res => res.data)
    .catch(err => logger.error(`${err.response.status}: ${err.response.data}`))
}

module.exports.up = async function() {
}

module.exports.down = async function() {
}
