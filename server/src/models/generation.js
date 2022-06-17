const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GenerationSchema = new Schema({
    id: { type: Number, min: 1, required: true, unique: true },
    name: { type: String, required: true, unique: true },
})

module.exports = mongoose.model("Generation", GenerationSchema)