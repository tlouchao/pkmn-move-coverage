"use strict"

import React from "react"
import ReactDOM from "react-dom/client"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<div>
    <h1>Hello, Galaxy!</h1>
    <img src="public/assets/pokeball.jpg" alt="pokeball.jpg" />
</div>
)

async function httpGet(url) {
    const result = await fetch(url,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status)
            }
            console.log("OK")
            return response.json()
        })
        .then(data => {
            console.log("data")
            if ("pokemon_species" in data){
                return data.pokemon_species.map(x => x.name)
            } else {
                return JSON.stringify(data)
            }
        })
        .catch(err => {
            console.log(err)
            return err
        })
    if (typeof result[Symbol.iterator] === "function" && 
    typeof result !== "string") {

        let ul = document.createElement("ul")
        ul.setAttribute("id", "response")
        document.body.appendChild(ul)

        for (const r of result){
            let li = document.createElement("li")
            li.innerHTML = r
            document.getElementById("response").append(li)
        }

    } else {
        let p = document.createElement("p")
        p.setAttribute("id", "response")
        p.innerHTML = result
        document.body.appendChild(p)
    }
}

httpGet("https://pokeapi.co/api/v2/generation/1")