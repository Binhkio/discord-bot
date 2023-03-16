const express = require("express");

const server = express();

server.all("/", (req, res) => {
    res.send("Bot is running now!");
})

function keepAlive() {
    server.listen(3000, () => {
        console.log("Server is running !");
    })
}

module.exports = keepAlive;