const { createGeneration }  = require("../../src/seed/generationSeed")
const { setupTeardown, validateNotEmpty, validateMongoDupeError } = require("../memoryUtils")

// setup and teardown
let g1
beforeEach(async() => {
    g1 = await createGeneration(1, "Generation I")
    validateNotEmpty(g1)
})

setupTeardown()

// tests
describe("Insert one generation", () => {

    it("Should insert valid ID and name", async() => {
        expect(g1.id).toEqual(1)
        expect(g1.name).toEqual("Generation I")
    })

    it("Should not insert if ID exists", async() => {
        try {
            await createGeneration(1, "Generation I")
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if name exists", async() => {
        try {
            await createGeneration(99, "Generation I")
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })
})

describe("Insert multiple generations", () => {
    
    it("Should insert two", async() => {
        const g2 = await createGeneration(2, "Generation II")
        validateNotEmpty(g2)
        expect(g2.id).toEqual(2)
        expect(g2.name).toEqual("Generation II")
    })
})