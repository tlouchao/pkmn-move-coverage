'use strict'
const { setupTeardown } = require("../memoryUtils")

const { baseURL, typeURL, generationURL, pkmnURL, getURLID, damageRelationsMap } = require("../../src/pokeapi")
const { queryMap } = require("../../src/db")
const logger = require("../../src/logger")
const axios = require('axios')

const Generation = require("../../src/models/generation")
const Type = require("../../src/models/type")
const Species = require("../../src/models/species")

const { createMoveLearnedBySpecies }  = require("../../src/seed/moveLearnedBySpeciesSeed")
const { createMove }  = require("../../src/seed/moveSeed")
const { createSpecies }  = require("../../src/seed/speciesSeed")
const { createGeneration }  = require("../../src/seed/generationSeed")
const { createType, updateType }  = require("../../src/seed/typeSeed")

setupTeardown()

test("Axios invalid get request returns error", async() => {
    try {
        await axios.get(baseURL + "/generation/99")
    } catch (err) {
        expect(err.response.status).toEqual(404)
    }
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
            const typeIds = await queryMap(Type, "id")

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

describe(`Insert move and species data into DB`, () => {

    // before test, insert generation and type models into DB
    let responses
    beforeEach(async() => {

        const promises = [axios(baseURL + generationURL), axios(baseURL + typeURL)]
        responses = await Promise.all(promises)
        
        for (const idx in responses){
            const createModels = [createGeneration, createType]
            for (const r of responses[idx].data.results){
                const id = getURLID(r.url)
                await createModels[idx](id, r.name)
            }
        }
    })

    it(`Successful create in DB`, async() => {
        
        let t1, t2 // measure performance
        let ids = [], names = [], generations = []
        let primary_types = [], secondary_types = []

        const genIds = await queryMap(Generation, "id")
        const typeNames = await queryMap(Type, "name")

        // concurrent get requests per generation (151 reqs for Gen 1, 101 reqs for Gen 2, etc.)
        for (const genId of Object.keys(genIds)){
            
            t1 = Date.now()
            let pkmnPromises = []

            const genResponse = await axios.get(baseURL + "/generation/" + genId)
            let ordered_species = genResponse.data.pokemon_species
            ordered_species.sort((a, b) => { // sort by national dex ID
                const [au, bu] = [getURLID(a.url), getURLID(b.url)]
                return (au == bu) ? 0 : ((au < bu) ? -1 : 1)
            })
            ordered_species.forEach(x => {
                ids.push(getURLID(x.url))
                names.push(x.name)
                generations.push(genIds[genId])
                pkmnPromises.push(axios(baseURL + pkmnURL + '/' + getURLID(x.url)))
            })

            const pkmnResponses = await Promise.all(pkmnPromises)

            pkmnResponses.forEach(x => {
                const pr = x.data.types[0].type.name
                const se = (x.data.types.length > 1) ? x.data.types[1].type.name : null
                primary_types.push(typeNames[pr])
                secondary_types.push(typeNames[se])
            })

            t2 = Date.now()
            logger.info(`Generation ${genId} promises time elapsed: ${t2 - t1} ms`)
        }
        // DB inserts are not concurrent
        t1 = Date.now()
        for (let i = 0; i < ids.length; i++){
            await createSpecies(ids[i], names[i], generations[i], primary_types[i], secondary_types[i])
        }
        t2 = Date.now()
        logger.info(`Create species promises time elapsed: ${t2 - t1} ms`)

        // check contents of DB
        const charizard = await Species.findOne({name: "charizard"})
        .populate("generation primary_type secondary_type")
        expect(charizard.id).toEqual(6)
        expect(charizard.generation.id).toEqual(1)
        expect(charizard.primary_type.name).toEqual("fire")
        expect(charizard.secondary_type.name).toEqual("flying")

        const sylveon = await Species.findOne({name: "sylveon"})
        .populate("generation primary_type secondary_type")
        console.log(sylveon)
        expect(sylveon.id).toEqual(700)
        expect(sylveon.generation.id).toEqual(6)
        expect(sylveon.primary_type.name).toEqual("fairy")
        expect(sylveon.secondary_type).toBeNull()

    }, 60000) // 1 minute timeout
})
