const { validateRefs, validateRefsMsg } = require("../validators")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TypeSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  ddfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateRefs, message: validateRefsMsg}]},
  ddto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateRefs, message: validateRefsMsg}]},
  hdfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateRefs, message: validateRefsMsg}]},
  hdto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateRefs, message: validateRefsMsg}]},
  ndfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateRefs, message: validateRefsMsg}]},
  ndto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validateRefs, message: validateRefsMsg}]},
})

module.exports = mongoose.model("Type", TypeSchema)