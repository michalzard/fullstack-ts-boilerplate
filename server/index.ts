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
import pg from "pg";

const { Pool } = pg;
export const db = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT! || 5432,//5432 is default postgres
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    
})
db.connect().then(() => { console.log("PG database connected") }).catch(console.error);


app.use(cors({ origin: true })); //specify origin if you want to allow only certain domain to communicate with this server
app.get("/", (req, res) => {
    res.status(200).send({ message: "Example Api" });
})

// Routes
import counterRoute from "./routes/counter";
app.use("/counter", counterRoute);

server.listen(process.env.PORT, () => { console.log(`Web server is running on ${process.env.PORT} with SSL enabled`) })