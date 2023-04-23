"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = exports.createSessionTable = exports.createUserTable = exports.createCounterTable = void 0;
exports.createCounterTable = `
CREATE TABLE IF NOT EXISTS persistance(counter INT DEFAULT 0); 
INSERT INTO persistance(counter) SELECT 0 WHERE NOT EXISTS(SELECT counter FROM persistance);
`;
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
    user_pk INT REFERENCES "user"(pk)
);
`;
exports.createTables = exports.createCounterTable + exports.createUserTable + exports.createSessionTable;
