"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionByToken = exports.findSessionByPrimaryKey = exports.findSessionByToken = exports.saveToSession = exports.findUserByPrimaryKey = exports.findUserByUsername = exports.registerUser = exports.checkExistingUser = void 0;
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
INSERT INTO "session"(token,user_pk) VALUES($1,$2);
`;
exports.findSessionByToken = `
SELECT * FROM "session" WHERE token = $1;
`;
exports.findSessionByPrimaryKey = `
SELECT * FROM "session" WHERE user_pk = $1;
`;
exports.deleteSessionByToken = `
DELETE FROM "session" WHERE token = $1;
`;
