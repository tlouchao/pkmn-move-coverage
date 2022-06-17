const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TypeSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  ddfrom: [{ type: Schema.Types.ObjectId, ref: "Type" }],
  ddto: [{ type: Schema.Types.ObjectId, ref: "Type" }],
  hdfrom: [{ type: Schema.Types.ObjectId, ref: "Type" }],
  hdto: [{ type: Schema.Types.ObjectId, ref: "Type" }],
  ndfrom: [{ type: Schema.Types.ObjectId, ref: "Type" }],
  ndto: [{ type: Schema.Types.ObjectId, ref: "Type" }]
})

module.exports = mongoose.model("Type", TypeSchema)