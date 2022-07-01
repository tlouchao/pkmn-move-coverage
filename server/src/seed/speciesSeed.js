const Species = require("../models/species")

async function createSpecies(id, name, generation, primary_type, secondary_type = null){
    try {
        const s = new Species({id: id, 
                              name: name, 
                              generation: generation, 
                              primary_type: primary_type, 
                              secondary_type: secondary_type})
        return await s.save()
    } catch (err) {
        throw err
    }
}

module.exports = { createSpecies }