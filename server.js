import express from "express";

const server = express();

server.all("/", (req, res) => {
    res.send("Bot is running now!");
})

export function keepAlive() {
    server.listen(3000, () => {
        console.log("Server is running !");
    })
}
