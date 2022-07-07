module.exports.baseURL = "https://pokeapi.co/api/v2"

module.exports.generationURL = "/generation"

module.exports.typeURL = "/type"

module.exports.pkmnURL = "/pokemon"

module.exports.moveURL = "/move"

module.exports.damageRelationsMap = {
    "double_damage_from": "ddfrom",
    "double_damage_to": "ddto",
    "half_damage_from": "hdfrom",
    "half_damage_to": "hdto",
    "no_damage_from": "ndfrom",
    "no_damage_to": "ndto",
}

module.exports.getURLID = path => {
    const last = path.split('/').filter(x => x != '').slice(-1)[0]
    return isNaN(last) ? last : parseInt(last)
}