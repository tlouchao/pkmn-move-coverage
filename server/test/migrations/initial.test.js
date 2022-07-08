// imports ----------------------------------------------------------------- //

const {
    baseURL,
    pkmnURL, 
    typeURL, 
    generationURL
} = require("../../src/pokeapi")

const { 
    Generation, 
    Type, 
    Species, 
    Move, 
    MoveLearnedBySpecies 
} = require("../../src/db").models

const { 
    createGeneration, 
    createType, updateType, 
    createSpecies, 
    createMove, 
    createMoveLearnedBySpecies 
} = require("../../src/db").seeds

const { getURLID, damageRelationsMap } = require("../../src/pokeapi")
const { getDBQueryMap } = require("../../src/db")
const { setupTeardown, validateNotEmpty } = require("../memoryUtils")
const axios = require('axios')

const { createLogger, format, transports } = require('winston')
const logger = createLogger({
    format: format.printf(info => `${info.level}: ${info.message}`),
    transports: [ new transports.File({ filename: './test/migrations/initial-perf.log' })]
})

const reqTimeout = 120000
jest.setTimeout(10000)

// setup ------------------------------------------------------------------- //

setupTeardown()

async function getResponseAndLog(fn, gen='', name=''){

    let t1 = Date.now()
    const result = await fn
    let t2 = Date.now()

    logger.info(`Generation ${gen}: ${name} promises time elapsed: ${t2 - t1} ms`)
    return result

}

// tests ------------------------------------------------------------------- //

describe("Axios invalid get request returns error", () => {
    it("404 Not found", async() => {
        try {
            await axios.get(baseURL + "/generation/99")
            logger.info("Success")
        } catch (err) {
            expect(err.response.status).toEqual(404)
            logger.info("Failure")
        }
    })
})

describe.skip.each([ 
    [generationURL, 1, "generation-i", Generation, createGeneration],
    [typeURL, 1, "normal", Type, createType]
])(`Insert data into DB`, (URL, id, name, model, createModel) => {

    let data
    beforeEach(async() => {
        const response = await axios.get(baseURL + URL)
        data = response.data
    })

    it(`Axios get request retrieves ${model} data`, async() => {

        expect("results" in data).toBeTruthy()
        expect(Array.isArray(data.results)).toBeTruthy()

        const res_id = getURLID(data.results[0].url)
        const res_name = data.results[0].name

        expect(res_id).toEqual(id)
        expect(res_name).toEqual(name)
    })

    it("Successful create in DB", async() => {
        for (const r of data.results){
            const id = getURLID(r.url)
            await createModel(id, r.name)
        }

        const collection = await model.find({})
        expect(collection[0].id).toEqual(id)
        expect(collection[0].name).toEqual(name)
    })
})

describe.skip(`Update type data concurrently in DB`, () => {

    // get types
    let data
    beforeEach(async() => {

        const response = await axios.get(baseURL + typeURL)
        data = response.data

        for (const r of data.results){
            const id = getURLID(r.url)
            await createType(id, r.name)
        }
    })

    it(`Successful update in DB`, async() => {

        try {
            let ids = [], names = []
            let axiosPromises = [], axiosResponses = []

            // id: _id
            const typeIds = await getDBQueryMap(Type, "id")

            // get name/url from response
            for (const r of data.results){
                ids.push(getURLID(r.url))
                names.push(r.name)
                axiosPromises.push(axios(r.url))
            }

            // get types details concurrently
            axiosResponses = await Promise.all(axiosPromises)

            // update damage relations concurrently
            let updatePromises = []

            for (const i in axiosResponses){
                const dmg = axiosResponses[i].data.damage_relations
                for (const key of Object.keys(dmg)) {
                    updatePromises.push(updateType(ids[i], damageRelationsMap[key], 
                        dmg[key].map(x => typeIds[getURLID(x.url)])))
                }
            }

            await Promise.all(updatePromises) 

            // check DB contents
            const actual = await Type.findOne({name: "fighting"})
                .populate({path: "ddfrom", select: "-_id name"})
                .populate({path: "ddto", select: "-_id name"})

            const expected = {
                ddfrom: ['flying', 'psychic', 'fairy'],
                ddto: ['normal', 'rock', 'steel', 'ice', 'dark']
            }

            expect(actual.ddfrom.map(x => x.name).sort()).toEqual(expected.ddfrom.sort())
            expect(actual.ddto.map(x => x.name).sort()).toEqual(expected.ddto.sort())

        } catch (err) { 
            throw err
        }
    })
})

describe.skip(`Insert move and species data into DB`, () => {

    let t1, t2, t1_total, t2_total
    let genIds, typeNames
    let pkmnSchemaFields, moveSchemaFields, movesLBSSchemaFields

    // map key to corresponding ObjectIds in DB, for table joins

    beforeEach(async() => {

        t1_total = Date.now()

        pkmnSchemaFields = [], moveSchemaFields = [], movesLBSSchemaFields = []

        // setup generation and type models into DB
        const promises = [axios(baseURL + generationURL), axios(baseURL + typeURL)]
        const responses = await Promise.all(promises)
        
        for (const idx in responses){
            const createModels = [createGeneration, createType]
            for (const r of responses[idx].data.results){
                const id = getURLID(r.url)
                await createModels[idx](id, r.name)
            }
        }

        genIds = await getDBQueryMap(Generation, "id")
        typeNames = await getDBQueryMap(Type, "name")

        // concurrent get requests per generation (151 reqs for Gen 1, 101 reqs for Gen 2, etc.)
        for (const genId of Object.keys(genIds)){
            
            const genResponse = await getResponseAndLog(axios.get(baseURL + generationURL + '/' + genId), genId, "gen")
            
            // prepare axios promises from generation data
            let pkmnPromises = [], movePromises = []
            let ordered_species = genResponse.data.pokemon_species
            ordered_species.sort((a, b) => { // sort by national dex ID
                const [au, bu] = [getURLID(a.url), getURLID(b.url)]
                return (au == bu) ? 0 : ((au < bu) ? -1 : 1)
            })
            ordered_species.forEach(x => pkmnPromises.push(axios(baseURL + pkmnURL + '/' + getURLID(x.url))))
            const pkmnResponses = await getResponseAndLog(Promise.all(pkmnPromises), genId, "pkmn")

            genResponse.data.moves.forEach(x => movePromises.push(axios(x.url)))
            const moveResponses = await getResponseAndLog(Promise.all(movePromises), genId, "move")

            // prepare DB promises from pkmn and move data
            pkmnResponses.forEach(x => {

                const p = x.data
                const pr = p.types[0].type.name
                const se = (p.types.length > 1) ? p.types[1].type.name : null
                pkmnSchemaFields.push([p.id, p.name, genIds[genId], typeNames[pr], typeNames[se]])

            })

            moveResponses.forEach(x => {

                const m = x.data
                moveSchemaFields.push([m.id, m.name, genIds[genId], typeNames[m.type.name], m.power, m.pp, m.accuracy])

                // one to many 
                m.learned_by_pokemon.forEach(y => { 
                    movesLBSSchemaFields.push({ moveName: m.name, pkmnName: y.name })
                })

            })
        }
    }, reqTimeout)

    it.skip(`Successful species creation in DB`, async() => {

        // Species DB inserts are not concurrent
        t1 = Date.now()
        for (const args of pkmnSchemaFields) { await createSpecies(...args) }

        t2 = Date.now()
        logger.info(`Create species promises time elapsed: ${t2 - t1} ms`)

        const charizard = await Species.findOne({name: "charizard"})
        .populate("generation primary_type secondary_type")
        validateNotEmpty(charizard)
        expect(charizard.id).toEqual(6)
        expect(charizard.generation.id).toEqual(1)
        expect(charizard.primary_type.name).toEqual("fire")
        expect(charizard.secondary_type.name).toEqual("flying")

        const sylveon = await Species.findOne({name: "sylveon"})
        .populate("generation primary_type secondary_type")
        validateNotEmpty(sylveon)
        expect(sylveon.id).toEqual(700)
        expect(sylveon.generation.id).toEqual(6)
        expect(sylveon.primary_type.name).toEqual("fairy")
        expect(sylveon.secondary_type).toBeNull()

        t2_total = Date.now()
        logger.info(`Total time elapsed: ${t2_total - t1_total} ms`)
        logger.info(`Done`)

    }, reqTimeout)

    it.skip(`Successful move creation in DB`, async() => {

        const gdname = "giga-drain"

        // Species DB inserts are not concurrent
        t1 = Date.now()
        for (const args of pkmnSchemaFields) { await createSpecies(...args) }

        t2 = Date.now()
        logger.info(`Create DB species promises time elapsed: ${t2 - t1} ms`)

        // Move DB inserts are not concurrent
        t1 = Date.now()
        for (const args of moveSchemaFields) { await createMove(...args) }
        t2 = Date.now()
        logger.info(`Create DB moves promises time elapsed: ${t2 - t1} ms`)

        const gigaDrain = await Move.findOne({name: gdname}).populate("generation type")
        validateNotEmpty(gigaDrain)

        expect(gigaDrain.id).toEqual(202)
        expect(gigaDrain.name).toEqual(gdname)
        expect(gigaDrain.generation.id).toEqual(2)
        expect(gigaDrain.type.name).toEqual("grass")

        const moveNames = await getDBQueryMap(Move, "name")
        const pkmnNames = await getDBQueryMap(Species, "name")

        t1 = Date.now()

        console.log(movesLBSSchemaFields[0])

        for (const ms of movesLBSSchemaFields) {
            const [move, pkmn] = [ms.moveName, ms.pkmnName]
            console.log(`${move}, ${pkmn}: ${moveNames[move]}, ${pkmnNames[pkmn]}`) 
            await createMoveLearnedBySpecies(moveNames[move], pkmnNames[pkmn])
        }
        t2 = Date.now()
        logger.info(`Create DB MLBS promises time elapsed: ${t2 - t1} ms`)

        const gigaDrainLearned = 
            await MoveLearnedBySpecies.find({moveId: moveNames[gdname]}).populate("move species")
        console.log(gigaDrainLearned)

        validateNotEmpty(gigaDrainLearned)
        expect(gigaDrainLearned[0].move.id).toEqual(202)
        expect(gigaDrainLearned[0].move.name).toEqual("grass")

        t2_total = Date.now()
        logger.info(`Total time elapsed: ${t2_total - t1_total} ms`)
        logger.info(`Done`)

    }, reqTimeout)
})
