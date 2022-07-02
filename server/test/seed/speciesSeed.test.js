const { createGeneration } = require("../../src/seed/generationSeed")
const { createType } = require("../../src/seed/typeSeed")
const { createSpecies } = require("../../src/seed/speciesSeed")
const { generateId,
        setupTeardown, 
        validateNotEmpty, 
        validateMongoDupeError,
        validateMongoValidationError } = require("../memoryUtils")

// setup and teardown
const zeroId = generateId()
const decId = generateId(10)

let s1, g1, t1
beforeEach(async() => {
    t1 = await createType(1, "grass")
    g1 = await createGeneration(1, "Generation I")
    s1 = await createSpecies(1, "Bulbasaur", g1._id, t1._id)
})

setupTeardown()

// tests
describe("Insert one species", () => {

    it("Should insert valid ID, name, and existing object IDs", () => {
        expect(s1.id).toEqual(1)
        expect(s1.name).toEqual("Bulbasaur")
        expect(s1.generation.toString()).toEqual(g1._id.toString())
        expect(s1.primary_type.toString()).toEqual(t1._id.toString())
    })

    it("Should not insert if ID exists", async() => {
        try {
            await createSpecies(1, "Bulbasaur", g1._id, t1._id)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if name exists", async() => {
        try {
            await createSpecies(99, "Bulbasaur", g1._id, t1._id)
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if foreign keys do not exist", async() => {
        try {
            await createSpecies(1, "Bulbasaur", zeroId, decId)
        } catch (err) {
            validateMongoValidationError(err.name, err.message, 
                `"${zeroId}" does not exist in generation path`)
            validateMongoValidationError(err.name, err.message, 
                `"${decId}" does not exist in primary_type path`)
        }
    })

    it("Should not insert if secondary type object ID does not exist", async() => {
        try {
            await createSpecies(1, "Bulbasaur", g1._id, t1._id, zeroId)
        } catch (err) {
            validateMongoValidationError(err.name, err.message, 
                `"${zeroId}" does not exist in secondary_type path`)
        }
    })
})

describe("Insert multiple species", () => {
    
    it("Should insert another", async() => {

        const t2 = await createType(2, "fire")
        const s2 = await createSpecies(4, "Charmander", g1._id, t2._id)
        validateNotEmpty(s2)

        expect(s2.id).toEqual(4)
        expect(s2.name).toEqual("Charmander")
        expect(s2.generation.toString()).toEqual(g1._id.toString())
        expect(s2.primary_type.toString()).toEqual(t2._id.toString())
    })

    it("Should insert another w/ secondary type", async() => {

        const t2 = await createType(2, "fire")
        const t3 = await createType(3, "flying")
        const s3 = await createSpecies(6, "Charizard", g1._id, t2._id, t3._id)
        validateNotEmpty(s3)

        expect(s3.id).toEqual(6)
        expect(s3.name).toEqual("Charizard")
        expect(s3.generation.toString()).toEqual(g1._id.toString())
        expect(s3.primary_type.toString()).toEqual(t2._id.toString())
        expect(s3.secondary_type.toString()).toEqual(t3._id.toString())
    })
})