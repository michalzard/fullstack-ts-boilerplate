"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selfsigned_1 = __importDefault(require("selfsigned"));
const fs_1 = __importDefault(require("fs"));
const attributes = [{ name: "localhost", value: "localhost", type: "commonName" }];
selfsigned_1.default.generate(attributes, { days: 365 }, (err, pems) => {
    if (err)
        console.log(err);
    else {
        fs_1.default.writeFileSync("./certs/cert.pem", pems.cert);
        fs_1.default.writeFileSync("./certs/key.pem", pems.private);
    }
});
