const { createMoveLearnedBySpecies }  = require("../../src/seed/moveLearnedBySpeciesSeed")
const { generateId, 
        setupTeardown, 
        validateNotEmpty} = require("../memoryUtils")

// setup and teardown
const zeroId = generateId()
setupTeardown()

describe("Insert one move learned by species", () => {
    it("should accept existing object IDs", async() => {
        const m1 = await createMoveLearnedBySpecies(zeroId, zeroId)
        validateNotEmpty(m1)
        expect(m1.move.toString()).toEqual(zeroId)
        expect(m1.species.toString()).toEqual(zeroId)
    })
})