module.exports.validateNotEmpty = (actual) => {
    expect(actual).not.toBeNull()
    expect(actual).not.toBeUndefined()
    expect(actual).toBeTruthy()
}

module.exports.validateMongoDupeError = (name, code) => {
    expect(name).toEqual("MongoServerError")
    expect(code).toBe(11000)
}