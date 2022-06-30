const Type = require("../models/type")

async function createType(id, name){
    try {
        const t = new Type({id: id, name: name})
        return await t.save()
    } catch (err) {
        throw err
    }
}

async function updateType(first_id, second_id, arr){
    // todo
    return
}

module.exports = { createType }