"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.userSession = exports.userLogin = exports.userRegistration = void 0;
const cuid2_1 = require("@paralleldrive/cuid2");
const argon2 = __importStar(require("argon2"));
const __1 = require("..");
const authQuery_1 = require("../sql/authQuery");
async function userRegistration(req, res) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await __1.db.query(authQuery_1.checkExistingUser, [username, email]);
        if (existingUser.rowCount > 0) {
            res.status(400).send({ message: "Username or email is already in use." });
        }
        else {
            const hashedPassword = await argon2.hash(password);
            const generatedId = (0, cuid2_1.createId)();
            const registeredUser = await __1.db.query(authQuery_1.registerUser, [username, email, hashedPassword, generatedId]);
            if (registeredUser.rowCount === 0)
                return res.status(400).send({ message: "Bad Request" });
            else {
                const user = registeredUser.rows[0];
                const { pk, ...filteredUser } = user;
                const date = new Date();
                date.setDate(date.getDate() + 7);
                // save user to session
                await __1.db.query(authQuery_1.saveToSession, [generatedId, pk, date.toUTCString()]);
                // create session object with user id,current timestamp,generated Token that will be passed trough authorization header for client to save 
                res.header("Authorization", `Bearer ${generatedId}`);
                res.set("Access-Control-Expose-Headers", "Authorization");
                res.status(200).send({ message: "User Registered", user: filteredUser });
            }
        }
    }
    catch (err) {
        // handle error
        if (err instanceof Error) {
            console.log(err.message);
            if (err.message.includes("duplicate")) {
                res.status(400).send({ message: "Username or email is already in use." });
            }
            else {
                res.status(500).send({ message: "Internal Server Error" });
            }
        }
    }
}
exports.userRegistration = userRegistration;
async function userLogin(req, res) {
    const { username, password } = req.body;
    try {
        if (!username || !password)
            return res.status(400).send({ message: "Username and password are required" });
        const foundUser = await __1.db.query(authQuery_1.findUserByUsername, [username]);
        const user = foundUser.rows[0]; //first result
        if (user) {
            const isValidPassword = await argon2.verify(user.password, password);
            if (isValidPassword) {
                const { pk, password, ...rest } = user; //loaded from db
                const sessionObject = await __1.db.query(authQuery_1.findSessionByPK, [pk]);
                if (sessionObject) {
                    const sessionToken = sessionObject.rows[0].token;
                    res.header("Authorization", `Bearer ${sessionToken}`);
                    res.set("Access-Control-Expose-Headers", "Authorization");
                    res.status(200).send({ message: "User logged in", user: rest });
                }
            }
            else {
                res.status(401).send({ message: "Unauthorized" });
            }
        }
        else {
            res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
exports.userLogin = userLogin;
async function userSession(req, res) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    try {
        if (!token)
            return res.status(401).send({ message: "Unauthorized" });
        else {
            const session = await __1.db.query(authQuery_1.findSessionByToken, [token]);
            if (session.rowCount > 0) {
                //FIXME: rename to pk so it makes sense
                const userFK = session.rows[0].user_fk;
                const sessionUserByPK = await __1.db.query(authQuery_1.findUserByPrimaryKey, [userFK]);
                const foundUser = sessionUserByPK.rows[0];
                const { pk, password, ...user } = foundUser;
                res.status(200).send({ message: "Authorized", user });
            }
            else {
                return res.status(401).send({ message: "Unauthorized" });
            }
        }
    }
    catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
exports.userSession = userSession;
async function userLogout(req, res) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    try {
        if (!token)
            return res.status(401).send({ message: "Unauthorized" });
        else {
            __1.db.query(authQuery_1.deleteSessionByToken, [token]).then(dbres => {
                console.log(dbres.rows);
                res.status(200).send({ message: "Logged out" });
            }).catch(err => {
                console.log(err);
                res.status(404).send({ message: "Token expired" });
            });
        }
    }
    catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
exports.userLogout = userLogout;
