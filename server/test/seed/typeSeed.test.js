const { createType } = require("../../src/seed/typeSeed")
const { setupTeardown, validateNotEmpty, validateMongoDupeError } = require("../memoryUtils")

// setup and teardown
let t1
beforeEach(async() => {
    t1 = await createType(1, "normal")
    validateNotEmpty(t1)
})

setupTeardown()

// tests
describe("Insert one type", () => {

    it("Should insert valid ID and name", async() => {
        console.log(t1)
        expect(t1.id).toEqual(1)
        expect(t1.name).toEqual("normal")
        expect(t1.ddfrom).toHaveLength(0)
        expect(t1.ddto).toHaveLength(0)
    })

    it("Should not insert if ID exists", async() => {
        try {
            const t2 = await createType(1, "normal")
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })

    it("Should not insert if name exists", async() => {
        try {
            const t2 = await createType(99, "normal")
        } catch (err) {
            validateMongoDupeError(err.name, err.code)
        }
    })
})

describe("Insert multiple types", () => {
    it("Should insert two", async() => {
        const t2 = await createType(2, "fighting")
        validateNotEmpty(t2)
        expect(t2.id).toEqual(2)
        expect(t2.name).toEqual("fighting")
    })
})

describe("Insert and update type", () => {
    it("should reference another type", async() => {
        const t2 = await createType(2, "fighting")
        validateNotEmpty(t2)
        // todo
    })
})