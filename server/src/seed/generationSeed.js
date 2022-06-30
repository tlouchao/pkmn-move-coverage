const Generation = require("../models/generation")

async function createGeneration(id, name){
    try {
        const g = new Generation({id: id, name: name})
        return await g.save()
    } catch (err) {
        throw err
    }
}

module.exports = { createGeneration }