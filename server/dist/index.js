"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const http2_1 = __importDefault(require("http2"));
const http2_express_bridge_1 = __importDefault(require("http2-express-bridge"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const tables_1 = require("./sql/tables");
exports.db.connect().then(async () => {
    console.log("Database connected");
    exports.db.query(tables_1.createTables).then(() => console.log("Tables were created")).catch(console.error);
}).catch(console.error);
let app = null;
const http2Options = { key: fs_1.default.readFileSync("./certs/key.pem"), cert: fs_1.default.readFileSync("./certs/cert.pem"), allowHTTP1: true };
let server = null;
if (process.env.NODE_ENV === "production") {
    // HTTP/2 in production
    app = (0, http2_express_bridge_1.default)(express_1.default);
    server = http2_1.default.createSecureServer(http2Options, app);
}
else {
    // HTTP/1 for local development
    app = (0, express_1.default)();
    server = http_1.default.createServer(app);
}
app.use((0, cors_1.default)({ credentials: true, origin: true })); //specify origin if you want to allow only certain domain to communicate with this server
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).send({ message: "Example Api" });
});
// Routes
const counterRoute_1 = __importDefault(require("./routes/counterRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
app.use("/counter", counterRoute_1.default);
app.use("/auth", authRoute_1.default);
server.listen(process.env.PORT, () => { console.log(`Web ${process.env.NODE_ENV === "production" ? "h2" : "h1"} server is running on ${process.env.PORT}`); });
