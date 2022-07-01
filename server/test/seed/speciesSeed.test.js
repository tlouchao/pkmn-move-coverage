const { createSpecies }  = require("../../src/seed/speciesSeed")
const { zeroId,
        setupTeardown, 
        validateNotEmpty, 
        validateMongoDupeError } = require("../memoryUtils")

// setup and teardown
let s1
beforeEach(async() => {
    s1 = await createSpecies(1, "Bulbasaur", zeroId, zeroId)
    validateNotEmpty(s1)
})

setupTeardown()

// tests
describe("Insert one species", () => {

    it("Should insert valid ID and name", async() => {
        expect(s1.id).toEqual(1)
        expect(s1.name).toEqual("Bulbasaur")
        expect(s1.generation.toString()).toEqual(zeroId)
        expect(s1.primary_type.toString()).toEqual(zeroId)
    })

    it("Should not insert if ID exists", async() => {
        try {
            const s2 = await createSpecies(1, "Bulbasaur", zeroId, zeroId)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if name exists", async() => {
        try {
            const s2 = await createSpecies(99, "Bulbasaur", zeroId, zeroId)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })
})

describe("Insert multiple species", () => {
    
    it("Should insert two", async() => {
        const s2 = await createSpecies(2, "Generation II", zeroId, zeroId)
        validateNotEmpty(s2)
        expect(s2.id).toEqual(2)
        expect(s2.name).toEqual("Generation II")
        expect(s2.generation.toString()).toEqual(zeroId)
        expect(s2.primary_type.toString()).toEqual(zeroId)
    })
})