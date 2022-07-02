const mongoose = require("mongoose")
const Generation = require("../src/models/generation")
const Type = require("../src/models/type")

module.exports.isInGeneration = async(val) => await Generation.exists({_id: val})

module.exports.isInType = async(val) => await Type.exists({_id: val})

module.exports.isObjectId = val => mongoose.isValidObjectId(val)

module.exports.isInPathMsg = props => `"${props.value}" does not exist in ${props.path} path`

module.exports.isObjectIdMsg = props => `"${props.value}" must be an object ID'`