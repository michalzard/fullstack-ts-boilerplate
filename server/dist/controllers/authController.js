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
exports.readCookiesFromHeaders = exports.setHTTPOnlyCookie = exports.userLogout = exports.userSession = exports.userLogin = exports.userRegistration = void 0;
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
                // save user to session
                await __1.db.query(authQuery_1.saveToSession, [generatedId, pk]);
                // create session object with user id,current timestamp,generated Token that will be passed trough authorization header for client to save 
                setHTTPOnlyCookie(res, "sessionID", generatedId);
                res.status(200).send({ message: "User Registered", user: filteredUser });
            }
        }
    }
    catch (err) {
        // handle error
        console.log(err);
        if (err instanceof Error) {
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
        const users = await __1.db.query(authQuery_1.findUserByUsername, [username]);
        const foundUser = users.rows[0]; //first result
        if (foundUser) {
            const isValidPassword = await argon2.verify(foundUser.password, password);
            if (isValidPassword) {
                const { pk, password, ...user } = foundUser; //loaded from db
                const generatedId = (0, cuid2_1.createId)();
                await __1.db.query(authQuery_1.saveToSession, [generatedId, pk]);
                setHTTPOnlyCookie(res, "sessionID", generatedId);
                res.status(200).send({ message: "User logged in", user });
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
    const cookies = readCookiesFromHeaders(req);
    try {
        // TODO:load sessionID from cookies
        if (!cookies?.sessionID)
            return res.status(401).send({ message: "Unauthorized" });
        const session = await __1.db.query(authQuery_1.findSessionByToken, [cookies?.sessionID]);
        if (session.rowCount > 0) {
            const userPK = session.rows[0].user_pk;
            const sessionUserByPK = await __1.db.query(authQuery_1.findUserByPrimaryKey, [userPK]);
            const foundUser = sessionUserByPK.rows[0];
            const { pk, password, ...user } = foundUser;
            res.status(200).send({ message: "Authorized", user });
        }
        else {
            res.clearCookie("sessionID");
            res.status(401).send({ message: "Unauthorized" });
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
    const cookies = readCookiesFromHeaders(req);
    try {
        if (!cookies?.sessionID)
            return res.status(401).send({ message: "Unauthorized" });
        // TODO:load sessionID from cookies
        __1.db.query(authQuery_1.deleteSessionByToken, [cookies?.sessionID]).then(dbres => {
            res.clearCookie("sessionID");
            res.status(200).send({ message: "Logged out" });
        }).catch(err => {
            console.log(err);
            res.clearCookie("sessionID");
            res.status(404).send({ message: "Token expired" });
        });
    }
    catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
exports.userLogout = userLogout;
// Cookies Utils
/**
 * Sets name and value for Set-Cookie header
 * @param res express Response
 * @param name cookie name
 * @param value cookie value
 */
function setHTTPOnlyCookie(res, name, value) {
    res.cookie(name, value, { httpOnly: true, secure: process.env.NODE_ENV === "production" ? true : false });
}
exports.setHTTPOnlyCookie = setHTTPOnlyCookie;
/**
 * Reads cookies from request headers in order to parsed them into k,v pairs
 * @param req express Request
 * @returns Object with key,value pairs of all cookies
 */
function readCookiesFromHeaders(req) {
    const { cookie } = req.headers;
    const results = {};
    if (cookie) {
        const s = cookie.split(";");
        for (let i = 0; i < s.length; i++) {
            const cookie = s[i];
            const cSplit = cookie.split("=");
            if (cSplit)
                results[cSplit[0].trim()] = cSplit[1];
        }
    }
    else
        return null;
    return results;
}
exports.readCookiesFromHeaders = readCookiesFromHeaders;
