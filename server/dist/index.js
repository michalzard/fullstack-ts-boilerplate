"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http2_express_bridge_1 = __importDefault(require("http2-express-bridge"));
// import spdy from "spdy";
const http2_1 = __importDefault(require("http2"));
const fs_1 = __importDefault(require("fs"));
const app = (0, http2_express_bridge_1.default)(express_1.default);
const http2Options = { key: fs_1.default.readFileSync("./certs/key.pem"), cert: fs_1.default.readFileSync("./certs/cert.pem"), allowHTTP1: true };
const server = http2_1.default.createSecureServer(http2Options, app);
const cors_1 = __importDefault(require("cors"));
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
exports.db = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});
exports.db.connect().then(() => { console.log("PG database connected"); }).catch(console.error);
app.use((0, cors_1.default)({ origin: true })); //specify origin if you want to allow only certain domain to communicate with this server
app.get("/", (req, res) => {
    res.status(200).send({ message: "Example Api" });
});
// Routes
const counter_1 = __importDefault(require("./routes/counter"));
app.use("/counter", counter_1.default);
server.listen(process.env.PORT, () => { console.log(`Web server is running on ${process.env.PORT} with SSL enabled`); });
