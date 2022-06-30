const mongoose = require("mongoose")

module.exports.connectDB = async() => {
  await mongoose.connect(process.env.ATLAS_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to database')
    return mongoose.connection
  })
  .catch(err => {
    console.error(`Error connecting to the database. \n${err}`)
  })
}

module.exports.closeDB = async() => {
  await mongoose.connection.close()
  .then(() => {
    console.log('Closed connection')
  })
  .catch(err => {
    console.error(`Error closing connection. \n${err}`)
  })
}