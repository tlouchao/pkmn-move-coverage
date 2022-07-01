const Move = require("../models/move")

async function createMove(id, name, generation, type, pp=null, power=null, accuracy=null){
    try {
        const m = new Move({id: id, 
                            name: name, 
                            generation: generation, 
                            type: type, 
                            pp: pp,
                            power: power,
                            accuracy: accuracy})
        return await m.save()
    } catch (err) {
        throw err
    }
}

module.exports = { createMove }