const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { isObjectId, 
        isObjectIdMsg,
        isInGeneration,
        isInType,
        isInPathMsg } = require("../validator")

const MoveSchema = new Schema({
    id: { type: Number, min: 1, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    generation: { type: Schema.Types.ObjectId, ref: "Generation", required: true,
        validate: [{validator: isObjectId, message: isObjectIdMsg}, {validator: isInGeneration, message: isInPathMsg}]},
    type: { type: Schema.Types.ObjectId, ref: "Type", required: true,
        validate: [{validator: isObjectId, message: isObjectIdMsg}, {validator: isInType, message: isInPathMsg}]},
    pp: { type: Number },
    power: { type: Number },
    accuracy: { type: Number, min: 0, max: 100 }
})

module.exports = mongoose.model("Move", MoveSchema)