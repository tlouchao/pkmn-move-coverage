const server = require("./memoryServer")

module.exports.generateId = (num) => {
    // convert num to hex string
    let hex
    if (num >= 0 && num <= 255){
        hex = num.toString(16).padStart(2, '0')
    } else {
        hex = "00" // default
    }

    // 12-byte object ID
    let id = ''
    for (let i = 0; i < 12; i++){ 
        id += (hex) 
    } 
    return id
}

module.exports.setupTeardown = () => {
    beforeAll(async() => await server.connectDB())
    afterEach(async() => await server.clearDB())
    afterAll(async() => await server.closeDB())
}

module.exports.validateNotEmpty = (actual) => {
    expect(actual).not.toBeNull()
    expect(actual).not.toBeUndefined()
    expect(actual).toBeTruthy()
}

module.exports.validateMongoDupeError = (name, code) => {
    expect(name).toEqual("MongoServerError")
    expect(code).toBe(11000)
}

module.exports.validateMongoCastError = (name, code) => {
    expect(name).toEqual("CastError")
}

module.exports.validateMongoValidationError = (name, msg_actual, msg_expected) => {
    expect(name).toEqual("ValidationError")
    expect(msg_actual).toContain(msg_expected)
}