const express = require("express")
const mongoose = require("mongoose")

const root = process.env.NODE_ROOT
const url = process.env.ATLAS_URI
const port = process.env.PORT || 3000

const clientDist = root + "../client/dist"

// DB
const db =  mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
              console.log('Connected to database')
              return mongoose.connection
            })
            .catch(err => {
              console.error(`Error connecting to the database. \n${err}`)
            })

// controllers
const app = express()

app.use(express.static(clientDist))

app.get("/api", (req, res) => {
    res.send("Hello from server!")
})

app.get('*', (req, res) => {
  res.sendFile("index.html", {root: clientDist})
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})