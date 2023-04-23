import fs from "fs";
import express from "express";
import http from "http";
import http2 from "http2";
import express2 from "http2-express-bridge";
import dotenv from "dotenv";
dotenv.config();
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


let app = null;
const http2Options = { key: fs.readFileSync("./certs/key.pem"), cert: fs.readFileSync("./certs/cert.pem"), allowHTTP1: true };
let server = null;

if (process.env.NODE_ENV === "production") {
    // HTTP/2 in production
    app = express2(express);
    server = http2.createSecureServer(http2Options, app);
} else {
    // HTTP/1 for local development
    app = express();
    server = http.createServer(app);
}


app.use(cors({ credentials: true, origin: true })); //specify origin if you want to allow only certain domain to communicate with this server
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send({ message: "Example Api" });
})

// Routes
import counterRoute from "./routes/counterRoute";
import authRoute from "./routes/authRoute";
app.use("/counter", counterRoute);
app.use("/auth", authRoute);

server.listen(process.env.PORT, () => { console.log(`Web ${process.env.NODE_ENV === "production" ? "h2" : "h1"} server is running on ${process.env.PORT}`) })