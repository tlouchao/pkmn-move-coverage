"use strict"

// const _ = require("lodash")

let universe = document.getElementById("universe")
universe.innerHTML = "Hello, Pluto!"

// let answer = prompt("Welcome to the solar system!", "")

let p = document.createElement("p")
p.setAttribute("id", "neptune")
p.innerHTML = "Galaxian!"
document.body.appendChild(p)

const fruits = {
    orange: "soda",
    apple: "strudel",
    kiwi: "bird",
}

const compass = ["north", "south", "west"]

const loops = {...fruits}
loops.kiwi = "extinct"

console.log(`Fruits: ${fruits.kiwi}`)
console.log(`Loops: ${loops.kiwi}`)
