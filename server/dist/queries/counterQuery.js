"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseCounter = exports.initializeCounter = void 0;
exports.initializeCounter = `
CREATE TABLE IF NOT EXISTS persistance(counter INT DEFAULT 0); 
INSERT INTO persistance(counter) SELECT 0 WHERE NOT EXISTS(SELECT counter FROM persistance);
`;
exports.increaseCounter = `
UPDATE persistance SET counter = counter + 1 RETURNING counter;
`;
