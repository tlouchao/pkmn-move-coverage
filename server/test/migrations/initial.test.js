'use strict'
const { setupTeardown } = require("../memoryUtils")

const Generation = require("../../src/models/generation")
const Type = require("../../src/models/type")
const Species = require("../../src/models/species")

const { createMoveLearnedBySpecies }  = require("../../src/seed/moveLearnedBySpeciesSeed")
const { createMove }  = require("../../src/seed/moveSeed")
const { createSpecies }  = require("../../src/seed/speciesSeed")
const { createGeneration }  = require("../../src/seed/generationSeed")
const { createType, updateType }  = require("../../src/seed/typeSeed")

const baseURL = "https://pokeapi.co/api/v2"
const generationURL = "/generation"
const typeURL = "/type"
const moveURL = "/move"
const dexURL = "/pokedex/1"

const typeProps = {
    "double_damage_from": "ddfrom",
    "double_damage_to": "ddto",
    "half_damage_from": "hdfrom",
    "half_damage_to": "hdto",
    "no_damage_from": "ndfrom",
    "no_damage_to": "ndto",
}

const axios = require('axios')

const getLastPathItemHelper = path => {
    const segments = path.split('/').filter(x => x != '')
    const last = segments[segments.length - 1]
    return isNaN(last) ? last : parseInt(last)
}

setupTeardown()

// tests
test("Axios invalid get request returns error", async() => {
    try {
        await axios.get(baseURL + "/generation/99")
    } catch (err) {
        expect(err.response.status).toEqual(404)
    }
})

// generation & type 
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

        const res_id = getLastPathItemHelper(data.results[0].url)
        const res_name = data.results[0].name

        expect(res_id).toEqual(id)
        expect(res_name).toEqual(name)
    })

    it("Successful create in DB", async() => {
        for (const r of data.results){
            const id = getLastPathItemHelper(r.url)
            await createModel(id, r.name)
        }

        const collection = await model.find({})
        expect(collection[0].id).toEqual(id)
        expect(collection[0].name).toEqual(name)
    })
})

// update type damage relations
describe.skip(`Update type data concurrently in DB`, () => {

    let data
    beforeEach(async() => {

        const response = await axios.get(baseURL + typeURL)
        data = response.data

        for (const r of data.results){
            const id = getLastPathItemHelper(r.url)
            await createType(id, r.name)
        }
    })

    it(`Successful update in DB`, async() => {

        try {

            let ids = []
            let names = []
            let promises = []

            for (const r of data.results){

                ids.push(getLastPathItemHelper(r.url))
                names.push(r.name)
                promises.push(axios(r.url))

            }

            const responses = await Promise.all(promises)
            expect("damage_relations" in responses[0].data).toBeTruthy()
            for (const key of Object.keys(responses[0].data.damage_relations)) {
                expect(key in typeProps).toBeTruthy()
            }

            // iterate over props
            let updatePromises = []
            let objectIds = {}
            const objectIdsQuery = await Type.find({}).select("id _id")
            objectIdsQuery.forEach(x => objectIds[x.id] = x._id)

            for (const idx in responses){
                const dr = responses[idx].data.damage_relations
                for (const key of Object.keys(dr)) {
                    updatePromises.push(updateType(ids[idx], typeProps[key], 
                        dr[key].map(x => objectIds[getLastPathItemHelper(x.url)])))
                }
            }

            await Promise.all(updatePromises) 
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

    let responses
    beforeEach(async() => {

        const promises = [axios(baseURL + generationURL), axios(baseURL + typeURL)]
        responses = await Promise.all(promises)
        
        for (const idx in responses){
            const createModels = [createGeneration, createType]
            for (const r of responses[idx].data.results){
                const id = getLastPathItemHelper(r.url)
                await createModels[idx](id, r.name)
            }
        }
    })

    it(`Successful update in DB`, async() => {

        const dex_limit = 151

        let objectIds = { type: {}, generation: {} }
        const db_requests = [Type.find({}).select("name _id"), Generation.find({}).select("name _id")]
        const db_responses = await Promise.all(db_requests)

        Object.keys(objectIds).forEach((x, i) => db_responses[i].forEach(y => objectIds[x][y.name] = y._id))

        // insert nat dex entry number / name
        const dex_response = await axios.get(baseURL + dexURL)
        expect("pokemon_entries" in dex_response.data).toBeTruthy()

        let ids = [], names = [], generations = [], primary_types = [], secondary_types = []

        let pkmn_requests = []
        let species_requests = []

        for (const pe of dex_response.data.pokemon_entries){

            if (parseInt(pe.entry_number) > dex_limit){
                break
            }
            
            ids.push(pe.entry_number)
            names.push(pe.pokemon_species.name)

            pkmn_requests.push(axios(baseURL + '/pokemon/' + parseInt(pe.entry_number)))
            species_requests.push(axios(pe.pokemon_species.url))
        }


        // insert types / generations

        const pkmn_responses = await Promise.all(pkmn_requests)
        const species_responses = await Promise.all(species_requests)

        expect("types" in pkmn_responses[0].data).toBeTruthy()
        expect("generation" in species_responses[0].data).toBeTruthy()

        for (const idx in pkmn_responses){

            const sp_types = pkmn_responses[idx].data.types
            const pr = sp_types[0].type.name           
            const se = (sp_types.length > 1) ? sp_types[1].type.name : null
            const pk_gen = species_responses[idx].data.generation.name

            primary_types.push(objectIds.type[pr])
            secondary_types.push(objectIds.type[se])
            generations.push(objectIds.generation[pk_gen])
        }

        // DB inserts are not concurrent
        for (let i = 0; i < dex_limit; i++){
            await createSpecies(ids[i], names[i], generations[i], primary_types[i], secondary_types[i])
        }

        const arno = await Species.findOne({name: "articuno"}).populate("generation primary_type secondary_type")
        console.log(arno)
    }, 30000)
})
