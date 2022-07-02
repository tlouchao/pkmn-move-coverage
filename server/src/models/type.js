const mongoose = require("mongoose")
const Schema = mongoose.Schema

// avoid circular dependency by moving functions out of validator.js

const arrValidator = function(val) {
  return (!val) || // allow empty
    (val.every(x => mongoose.isValidObjectId(x)) &&
    new Set(val.map(x => x.toString())).size == val.length) // disallow duplicates
}

const isInTypeValidator = async function(val) {
  if (!val) { 
    return true
  } else {
    let res
    for (const v of val){
      res = await mongoose.model("Type", TypeSchema).exists({_id: v})
      if (!res) { return false }
    }
    return true
  }
}

const arrMessage = function(props) { 
  return `"${props.value}" must be an array of unique object IDs'`
}

const isInTypeMessage = function(props) {
  return `One or more of object IDs "${props.value}" does not exist in Type path`
}

const TypeSchema = new Schema({
  id: { type: Number, min: 1, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  ddfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [
      {validator: arrValidator, message: arrMessage}, 
      {validator: isInTypeValidator, message: isInTypeMessage}
    ]},
  ddto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [
      {validator: arrValidator, message: arrMessage}, 
      {validator: isInTypeValidator, message: isInTypeMessage}
    ]},
  hdfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [
      {validator: arrValidator, message: arrMessage}, 
      {validator: isInTypeValidator, message: isInTypeMessage}
    ]},
  hdto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [
      {validator: arrValidator, message: arrMessage}, 
      {validator: isInTypeValidator, message: isInTypeMessage}
    ]},
  ndfrom: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [
      {validator: arrValidator, message: arrMessage}, 
      {validator: isInTypeValidator, message: isInTypeMessage}
    ]},
  ndto: { type: [Schema.Types.ObjectId], ref: "Type",
    validate: [
      {validator: arrValidator, message: arrMessage}, 
      {validator: isInTypeValidator, message: isInTypeMessage}
    ]},
})

module.exports = mongoose.model("Type", TypeSchema)