const mongoose = require('mongoose')

const PkmnSchema = new mongoose.Schema({
  dex_id: { type: Number, min: 1, required: true, unique: true },
  dex_name: { type: String, required: true, unique: true }
})

module.exports = mongoose.model("Pkmn", PkmnSchema)