"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_1 = require("../index");
const counterQuery_1 = require("../sql/counterQuery");
router.get("/increment", async (req, res) => {
    try {
        index_1.db.query(counterQuery_1.increaseCounter).then(data => {
            const counterValue = data.rows[0].counter;
            if (counterValue)
                res.status(200).send({ message: "Counter incremented", counterValue });
            else
                res.status(400).send({ message: "There was issue incrementing counter!" });
        }).catch(err => console.log(err.message));
    }
    catch (err) {
        console.log(err instanceof Error ? err.message : err);
        res.status(500).send({ message: "Interal Server Error" });
    }
});
exports.default = router;
