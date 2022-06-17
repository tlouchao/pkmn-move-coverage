const Species = require("../models/species")

module.exports = async function createSpecies(id, name){
    const exists = await Species.findOne({id: id})
    if (exists) {
        throw new Error(`A Pokemon with ID=${id} and  
                        name=${name} already exists`)
    }
    const sp = new Species({id: id, name: name})
    return await sp.save()
}