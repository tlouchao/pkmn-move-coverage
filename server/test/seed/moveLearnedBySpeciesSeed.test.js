const { createMoveLearnedBySpecies }  = require("../../src/seed/moveLearnedBySpeciesSeed")
const { zeroId, 
        setupTeardown, 
        validateNotEmpty} = require("../memoryUtils")

// setup and teardown
setupTeardown()

describe("Insert one move learned by species", () => {
    it("should accept existing object IDs", async() => {
        const m1 = await createMoveLearnedBySpecies(zeroId, zeroId)
        validateNotEmpty(m1)
        expect(m1.move_id.toString()).toEqual(zeroId)
        expect(m1.species_id.toString()).toEqual(zeroId)
    })
})