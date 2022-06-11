const createPkmn = require("../../src/controllers/createPkmn")
const server = require("../memoryServer")
const utils = require("../memoryUtils")

beforeAll(async() => await server.connectDB())
afterEach(async() => await server.clearDB())
afterAll(async() => await server.closeDB())

describe("Insert one pokemon into DB", () => {

    it("Should insert valid ID and name", async() => {
        const p1 = await createPkmn(1, "Bulbasaur")

        utils.validateNotEmpty(p1)
        expect(p1.dex_id).toEqual(1)
        expect(p1.dex_name).toEqual("Bulbasaur")
    })

    it("Should not insert if ID/name exists", async() => {
        const p1 = await createPkmn(1, "Bulbasaur")

        utils.validateNotEmpty(p1)
        expect(p1.dex_id).toEqual(1)
        expect(p1.dex_name).toEqual("Bulbasaur")

        // insert dupe should fail
        let p2
        try {
            p2 = await createPkmn(2, "Bulbasaur")
        } catch (err) {
            utils.validateMongoDupeError(err.name, err.code)
        }
    })
})

describe("Insert multiple pokemon into DB", () => {
    it("Should insert two", async() => {
        const p1 = await createPkmn(1, "Bulbasaur")
        utils.validateNotEmpty(p1)

        const p2 = await createPkmn(4, "Charmander")
        utils.validateNotEmpty(p2)
        expect(p2.dex_id).toEqual(4)
        expect(p2.dex_name).toEqual("Charmander")
    })
})


