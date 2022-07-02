const { createGeneration }  = require("../../src/seed/generationSeed")
const { createType }  = require("../../src/seed/typeSeed")
const { createMove }  = require("../../src/seed/moveSeed")
const { setupTeardown, 
        validateNotEmpty, 
        validateMongoDupeError } = require("../memoryUtils")

// setup and teardown
let m1, g1, t1
beforeEach(async() => {
    t1 = await createType(1, "grass")
    g1 = await createGeneration(1, "Generation I")
    m1 = await createMove(1, "Giga Drain", g1._id, t1._id, 10, 60, 100)
    validateNotEmpty(m1)
})

setupTeardown()

// tests
describe("Insert one move", () => {

    it("Should insert valid ID and name", () => {
        expect(m1.id).toEqual(1)
        expect(m1.name).toEqual("Giga Drain")
        expect(m1.generation.toString()).toEqual(g1._id.toString())
        expect(m1.type.toString()).toEqual(t1._id.toString())
        expect(m1.pp).toEqual(10)
        expect(m1.power).toEqual(60)
        expect(m1.accuracy).toEqual(100)
    })

    it("Should not insert if ID exists", async() => {
        try {
            const m2 = await createMove(1, "Giga Drain", g1._id, t1._id)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if name exists", async() => {
        try {
            const m2 = await createMove(99, "Giga Drain", g1._id, t1._id)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })
})

describe("Insert multiple moves", () => {
    
    it("Should insert two", async() => {
        const m2 = await createMove(2, "Solarbeam", g1._id, t1._id, 5, 120, 100)
        validateNotEmpty(m2)
        expect(m2.id).toEqual(2)
        expect(m2.name).toEqual("Solarbeam")
        expect(m2.generation.toString()).toEqual(g1._id.toString())
        expect(m2.type.toString()).toEqual(t1._id.toString())
    })
})