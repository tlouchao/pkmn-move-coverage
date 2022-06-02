(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1]);
