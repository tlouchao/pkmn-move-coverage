"use strict"

const dotenv = require("dotenv")
const http = require("http")
const fs = require("fs")

dotenv.config()

console.log(process.env.NODE_ENV)

const server = http.createServer((req, res) => {

    let contentType = {}
    let filename

    console.log(req.url)

    switch(req.url){
    case "/":
        filename = "index.html"
        break
    case "/bundle.js":
        filename="bundle.js"
        break
    case "/public/favicon.ico":
        filename="public/favicon.ico"
        break
    default:
        filename = "error.html"
    }
  
    fs.readFile(filename, (err, data) => {
        if (err){
            console.log(err)
        } else {
            if (filename != "error.html") {
                res.writeHead(200, contentType)
            } else {
                res.writeHead(404, contentType)
            }
            res.write(data)
            return res.end()
        }
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${(process.env.PORT) ? 
                process.env.PORT : 
                3000}`)
})