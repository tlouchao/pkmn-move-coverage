const MoveLearnedBySpecies = require("../models/moveLearnedBySpecies")

async function createMoveLearnedBySpecies(move, species){
    try {
        const m = new MoveLearnedBySpecies({move: move, species: species})
        return await m.save()
    } catch (err) {
        throw err
    }
}

module.exports = { createMoveLearnedBySpecies }