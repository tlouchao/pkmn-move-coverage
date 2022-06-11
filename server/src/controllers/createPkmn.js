const Pkmn = require("../models/pkmn")

module.exports = async function createPkmn(id, name){
    const exists = await Pkmn.findOne({dex_id: id})
    if (exists) {
        throw new Error(`A Pokemon with ID=${id} and  
                        name=${name} already exists`)
    }
    const p = new Pkmn({dex_id: id, dex_name: name})
    return await p.save()
}