const { validateArrRef, validateArrRefMsg } = require("../validators")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TypeSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  ddfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateArrRef, message: validateArrRefMsg}]},
  ddto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateArrRef, message: validateArrRefMsg}]},
  hdfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateArrRef, message: validateArrRefMsg}]},
  hdto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateArrRef, message: validateArrRefMsg}]},
  ndfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateArrRef, message: validateArrRefMsg}]},
  ndto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateArrRef, message: validateArrRefMsg}]},
})

module.exports = mongoose.model("Type", TypeSchema)