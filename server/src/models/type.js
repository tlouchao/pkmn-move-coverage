const mongoose = require("mongoose")
const Schema = mongoose.Schema

const validator = function(val) {
  return (val == '') || (Array.isArray(val) &&
                        val.every(x => mongoose.isValidObjectId(x)) &&
                        new Set(val.map(x => x.toString())).size == val.length) // disallow duplicates
}

const message = function(props) { return `"${props.value}" must be an array of unique object IDs'`}

const TypeSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  ddfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validator, message: message}]},
  ddto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validator, message: message}]},
  hdfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validator, message: message}]},
  hdto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validator, message: message}]},
  ndfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validator, message: message}]},
  ndto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [{validator: validator, message: message}]},
})

module.exports = mongoose.model("Type", TypeSchema)