
const dotenv = require("dotenv")
const http = require('http')
const fs = require('fs')

dotenv.config()

const server = http.createServer((req, res) => {
  let contentType = {}
  let filename
  console.log(req.url)
  switch(req.url){
    case '/':
      filename = "index.html"
      contentType['Content-Type'] = 'text/html'
      break
    case '/index.js':
      filename='index.js'
      contentType['Content-Type'] = 'text/javascript'
      break
    case '/public/favicon.ico':
      filename='public/favicon.ico'
      contentType['Content-Type'] = 'image/x-icon'
      break
    default:
      filename = "error.html"
      contentType['Content-Type'] = 'text/html'
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

console.log(`Listening to port ${(process.env.PORT) ? process.env.PORT : 3000}`)
server.listen(process.env.PORT || 3000)