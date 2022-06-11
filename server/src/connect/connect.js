require("dotenv").config()

const Pkmn = require("../models/pkmn")

const mongoose = require('mongoose')
const url = process.env.ATLAS_URI

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function connect() {
    await mongoose.connect(url, connectionParams)
        .then(() => {
            console.log('Connected to database')
        })
        .catch(err => {
            console.error(`Error connecting to the database. \n${err}`)
        })

    await insertPkmn()
    await mongoose.connection.close()
    await mongoose.disconnect()
    console.log('Closed connection')
}

async function insertPkmn(){
  
  // const bulba = new Pkmn({ dex_id: 4, dex_name: "Charmander" })
  // await bulba.save()

  const findBulba = await Pkmn.find({dex_name: /saur$/});
  console.log(findBulba);

}

connect()