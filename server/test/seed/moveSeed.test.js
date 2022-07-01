const { createMove }  = require("../../src/seed/moveSeed")
const { zeroId, 
        setupTeardown, 
        validateNotEmpty, 
        validateMongoDupeError } = require("../memoryUtils")

// setup and teardown
let m1
beforeEach(async() => {
    m1 = await createMove(1, "Giga Drain", zeroId, zeroId)
    validateNotEmpty(m1)
})

setupTeardown()

// tests
describe("Insert one move", () => {

    it("Should insert valid ID and name", async() => {
        expect(m1.id).toEqual(1)
        expect(m1.name).toEqual("Giga Drain")
        expect(m1.generation.toString()).toEqual(zeroId)
        expect(m1.type.toString()).toEqual(zeroId)
    })

    it("Should not insert if ID exists", async() => {
        try {
            const m2 = await createMove(1, "Giga Drain", zeroId, zeroId)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if name exists", async() => {
        try {
            const m2 = await createMove(99, "Giga Drain", zeroId, zeroId)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })
})

describe("Insert multiple moves", () => {
    
    it("Should insert two", async() => {
        const m2 = await createMove(2, "Solarbeam", zeroId, zeroId)
        validateNotEmpty(m2)
        expect(m2.id).toEqual(2)
        expect(m2.name).toEqual("Solarbeam")
        expect(m2.generation.toString()).toEqual(zeroId)
        expect(m2.type.toString()).toEqual(zeroId)
    })
})