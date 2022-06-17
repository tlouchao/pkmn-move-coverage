const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SpeciesSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  generation: { type: Schema.Types.ObjectId, ref: "Generation", required: true },
  primary_type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  secondary_type: { type: Schema.Types.ObjectId, ref: "Type" },
})

module.exports = mongoose.model("Species", SpeciesSchema)