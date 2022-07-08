const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MoveLearnedBySpeciesSchema = new Schema({
    move: { type: Schema.Types.ObjectId, ref: "Move", required: true },
    species: { type: Schema.Types.ObjectId, ref: "Species", required: true },
})

module.exports = mongoose.model("MoveLearnedBySpecies", MoveLearnedBySpeciesSchema)