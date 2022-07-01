const mongoose = require("mongoose")

module.exports.validateRef = val => mongoose.isValidObjectId(val)

module.exports.validateRefMsg = props => `"${props.value}" must be an object ID'`

module.exports.validateArrRef = val => {
    if (val == ``) { // allow empty array
        return true
    } else {
        return Array.isArray(val) &&
            val.every(x => mongoose.isValidObjectId(x)) &&
            new Set(val.map(x => x.toString())).size == val.length // disallow duplicates
    }
}

module.exports.validateArrRefMsg = props => {
    return `"${props.value}" must be an array of unique object IDs'`
}