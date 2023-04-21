"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionByToken = exports.findSessionByPK = exports.findSessionByToken = exports.saveToSession = exports.findUserByPrimaryKey = exports.findUserByUsername = exports.registerUser = exports.checkExistingUser = exports.createSessionTable = exports.createUserTable = void 0;
exports.createUserTable = `
CREATE TABLE IF NOT EXISTS "user"(
    pk SERIAL PRIMARY KEY, 
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
	id CHAR(24) NOT NULL UNIQUE
);
`;
exports.createSessionTable = `
CREATE TABLE IF NOT EXISTS "session"(
    token CHAR(24) NOT NULL,
    user_fk INT REFERENCES "user"(pk),
	expiresIn TIMESTAMP
);
`;
// registration
exports.checkExistingUser = `
SELECT * FROM "user" WHERE username = $1 OR email = $2; 
`;
exports.registerUser = `
INSERT INTO "user"(username,email,password,id) VALUES($1,$2,$3,$4) RETURNING pk,id,username,email;
`;
// 
exports.findUserByUsername = `
SELECT * FROM "user" WHERE username = $1;
`;
exports.findUserByPrimaryKey = `
SELECT * from "user" WHERE pk = $1;
`;
//session
exports.saveToSession = `
INSERT INTO "session"(token,user_fk,expiresIn) VALUES($1,$2,$3);
`;
exports.findSessionByToken = `
SELECT * FROM "session" WHERE token = $1;
`;
exports.findSessionByPK = `
SELECT * FROM "session" WHERE user_fk = $1;
`;
exports.deleteSessionByToken = `
DELETE FROM "session" WHERE token = $1;
`;
