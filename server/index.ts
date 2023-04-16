import dotenv from "dotenv";
dotenv.config();
import express from "express";
import express2 from "http2-express-bridge";
// import spdy from "spdy";
import http2 from "http2";
import fs from "fs";
const app = express2(express);
const http2Options = { key: fs.readFileSync("./certs/key.pem"), cert: fs.readFileSync("./certs/cert.pem"), allowHTTP1: true };
const server = http2.createSecureServer(http2Options, app);
import cors from "cors";
console.log(process.env.CLIENT_URL);
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
    res.status(200).send({ message: "SSL enabled" });
})

server.listen(process.env.PORT, () => { console.log(`Web server is running on ${process.env.PORT} with SSL enabled`) })