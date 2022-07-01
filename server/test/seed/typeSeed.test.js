const Type = require("../../src/models/type")
const { createType, updateType } = require("../../src/seed/typeSeed")
const { setupTeardown, 
        validateNotEmpty, 
        validateMongoDupeError, 
        validateMongoCastError,
        validateMongoValidationError } = require("../memoryUtils")

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

    it("should reference list of types", async() => {

        const grass = await createType(4, "grass")
        const electric = await createType(5, "electric")
        
        // object id, NOT user-defined id
        let water = await createType(3, "water")
        water = await updateType(water.id, "ddfrom", [grass._id, electric._id])

        expect(water.id).toEqual(3)
        expect(water.name).toEqual("water")
        expect(water.ddfrom).toHaveLength(2)
        expect(water.ddfrom).toContainEqual(grass._id)
        expect(water.ddfrom).toContainEqual(electric._id)
    })

    it("should reject if not an array of object IDs", async() => {
        try {
            t3 = await updateType(t1.id, "hdfrom", [1, 2])
        } catch (err) {
            validateMongoCastError(err.name, err.code)
        }
    })

    it("should reject if array contains duplicate object IDs", async() => {
        const dup_id = "62bf2c571ae278d037f43bab"
        try {
            t3 = await updateType(t1.id, "hdto", [dup_id, dup_id])
        } catch (err) {
            validateMongoValidationError(err.name, err.message, 
                `"${dup_id},${dup_id}" must be an array of unique object IDs'`)
        }
    })
})