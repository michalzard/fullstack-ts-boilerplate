import express from "express";
const router = express.Router();
import { db } from "../index";
import { increaseCounter } from "../sql/counterQuery";

router.get("/increment", async (req, res) => {
    try {
        db.query(increaseCounter).then(data => {
            const counterValue = data.rows[0].counter;
            if (counterValue) res.status(200).send({ message: "Counter incremented", counterValue });
            else res.status(400).send({ message: "There was issue incrementing counter!" });
        }).catch(err => console.log(err.message));
    } catch (err) {
        console.log(err instanceof Error ? err.message : err);
        res.status(500).send({ message: "Interal Server Error" });
    }
})


export default router;