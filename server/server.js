require("dotenv").config()

const path = require("path")
const express = require("express")

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.get("/api", (req, res) => {
    res.send("Hello from server!")
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})