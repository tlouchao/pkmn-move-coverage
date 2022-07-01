const mongoose = require("mongoose")

module.exports.validateRefs = val => {
    if (val == ``) { // allow empty array
        return true
    } else {
        return Array.isArray(val) &&
            val.every(x => mongoose.isValidObjectId(x)) &&
            new Set(val.map(x => x.toString())).size == val.length // disallow duplicates
    }
}

module.exports.validateRefsMsg = props => {
    return `"${props.value}" must be an array of unique object IDs'`
}