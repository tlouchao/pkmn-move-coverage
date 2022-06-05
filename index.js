"use strict"

const _cloneDeep = require("lodash/cloneDeep")

//let universe = document.getElementById("universe")
//universe.innerHTML = "Hello, Pluto!"

let p = document.createElement("p")
p.setAttribute("id", "neptune")
p.innerHTML = "Galaxy!"
document.body.appendChild(p)

const fruits = {
    orange: "juice",
    apple: "strudel",
    kiwi: "bird",
    cornucopia: {
        corn: "cob"
    },
    summer() {
        console.log(`sunny summer swelter ${this.apple}`)
    },
}

const loops = _cloneDeep(fruits)

loops.cornucopia.corn = "bread"

console.log(`Fruits: ${fruits.cornucopia.corn}`)

console.log(`Loops: ${loops.cornucopia.corn}`)

async function goodNight() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("success!"), 2000)
    })
    let result
    try {
        result = await promise
        console.log(result)
    } catch(err) {
        console.log(err)
    } 
}

goodNight()


