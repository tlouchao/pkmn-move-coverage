const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { isObjectId,
        isEmptyOrObjectId,
        isInGeneration,
        isInType,
        isEmptyOrInType,
        isObjectIdMsg,
        isInPathMsg } = require("../validator")

const SpeciesSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  generation: { type: Schema.Types.ObjectId, ref: "Generation", required: true, 
        validate: [{validator: isObjectId, message: isObjectIdMsg}, {validator: isInGeneration, message: isInPathMsg}]},
  primary_type: { type: Schema.Types.ObjectId, ref: "Type", required: true,
        validate: [{validator: isObjectId, message: isObjectIdMsg}, {validator: isInType, message: isInPathMsg}]},
  secondary_type: { type: Schema.Types.ObjectId, ref: "Type", required: false,
        validate: [{validator: isEmptyOrObjectId, message: isObjectIdMsg}, {validator: isEmptyOrInType, message: isInPathMsg}]},
})

module.exports = mongoose.model("Species", SpeciesSchema)