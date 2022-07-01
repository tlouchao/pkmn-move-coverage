const { connectDB, closeDB } = require("./db")
const logger = require("./logger")
const express = require("express")

const root = process.env.NODE_ROOT
const port = process.env.PORT || 3000

const clientDist = root + "../client/dist"

connectDB()
const app = express()
app.use(express.static(clientDist))

app.get("/api", (req, res) => {
    res.send("Hello from server!")
})

app.get('*', (req, res) => {
  res.sendFile("index.html", {root: clientDist})
})

app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`)
})

process.on('SIGINT', async() => {
    logger.info("\nExiting...")
    await closeDB()
    process.exit()
})

process.on('SIGTERM', async() => {
    logger.info("\nExiting...")
    await closeDB()
    process.exit()
})