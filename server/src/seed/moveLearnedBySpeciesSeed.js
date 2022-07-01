const MoveLearnedBySpecies = require("../models/moveLearnedBySpecies")

async function createMoveLearnedBySpecies(move_id, species_id){
    try {
        const m = new MoveLearnedBySpecies({move_id: move_id, species_id: species_id})
        return await m.save()
    } catch (err) {
        throw err
    }
}

module.exports = { createMoveLearnedBySpecies }