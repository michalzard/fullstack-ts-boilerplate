"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseCounter = void 0;
exports.increaseCounter = `
UPDATE persistance SET counter = counter + 1 RETURNING counter;
`;
