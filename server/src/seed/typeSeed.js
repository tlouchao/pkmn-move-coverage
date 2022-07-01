const Type = require("../models/type")

async function createType(id, name){
    try {
        const t = new Type({id: id, name: name})
        return await t.save()
    } catch (err) {
        throw err
    }
}

async function updateType(id, key, val){
    try {
        return await Type.findOneAndUpdate({id: id}, {[key]: val}, {new: true, runValidators: true})
    } catch (err) {
        throw err
    }
}

module.exports = { createType, updateType }