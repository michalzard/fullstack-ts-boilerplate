import { Request, Response, NextFunction } from "express";
import { createId } from "@paralleldrive/cuid2";
import * as argon2 from "argon2";
import { db } from "..";
import { checkExistingUser, deleteSessionByToken, findSessionByPK, findSessionByToken, findUserByPrimaryKey, findUserByUsername, registerUser, saveToSession } from "../sql/authQuery";

export async function userRegistration(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await db.query(checkExistingUser, [username, email]);
        if (existingUser.rowCount > 0) {
            res.status(400).send({ message: "Username or email is already in use." });
        } else {
            const hashedPassword = await argon2.hash(password);
            const generatedId = createId();
            const registeredUser = await db.query(registerUser, [username, email, hashedPassword, generatedId]);
            if (registeredUser.rowCount === 0) return res.status(400).send({ message: "Bad Request" });
            else {
                const user = registeredUser.rows[0];
                const { pk, ...filteredUser } = user;
                const date = new Date();
                date.setDate(date.getDate() + 7);
                // save user to session
                await db.query(saveToSession, [generatedId, pk, date.toUTCString()]);
                // create session object with user id,current timestamp,generated Token that will be passed trough authorization header for client to save 
                res.header("Authorization", `Bearer ${generatedId}`);
                res.set("Access-Control-Expose-Headers", "Authorization");
                res.status(200).send({ message: "User Registered", user: filteredUser });
            }
        }
    } catch (err) {
        // handle error
        if (err instanceof Error) {
            console.log(err.message);
            if (err.message.includes("duplicate")) {
                res.status(400).send({ message: "Username or email is already in use." });
            } else {
                res.status(500).send({ message: "Internal Server Error" });
            }
        }
    }
}

export async function userLogin(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(400).send({ message: "Username and password are required" });
        const foundUser = await db.query(findUserByUsername, [username]);
        const user = foundUser.rows[0];//first result
        if (user) {
            const isValidPassword = await argon2.verify(user.password, password);
            if (isValidPassword) {
                const { pk, password, ...rest } = user; //loaded from db
                const sessionObject = await db.query(findSessionByPK, [pk]);
                if (sessionObject) {
                    const sessionToken = sessionObject.rows[0].token;
                    res.header("Authorization", `Bearer ${sessionToken}`);
                    res.set("Access-Control-Expose-Headers", "Authorization");
                    res.status(200).send({ message: "User logged in", user: rest });
                }
            } else {
                res.status(401).send({ message: "Unauthorized" });
            }
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export async function userSession(req: Request, res: Response) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    try {
        if (!token) return res.status(401).send({ message: "Unauthorized" });
        else {
            const session = await db.query(findSessionByToken, [token]);
            if (session.rowCount > 0) {
                //FIXME: rename to pk so it makes sense
                const userFK = session.rows[0].user_fk;
                const sessionUserByPK = await db.query(findUserByPrimaryKey, [userFK]);
                const foundUser = sessionUserByPK.rows[0];
                const { pk, password, ...user } = foundUser;
                res.status(200).send({ message: "Authorized", user });
            } else {
                return res.status(401).send({ message: "Unauthorized" });
            }
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export async function userLogout(req: Request, res: Response) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    try {
        if (!token) return res.status(401).send({ message: "Unauthorized" });
        else {
            db.query(deleteSessionByToken, [token]).then(dbres => {
                console.log(dbres.rows);

                res.status(200).send({ message: "Logged out" });
            }).catch(err => {
                console.log(err);
                res.status(404).send({ message: "Token expired" });
            })
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}