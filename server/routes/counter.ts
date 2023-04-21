import express from "express";
const router = express.Router();
import { db } from "../index";
import { increaseCounter, initializeCounter } from "../sql/counterQuery";

router.get("/increment", async (req, res) => {
    try {
        // check if table exists if it doesnt create it
        // if column exists update + 1 if not insert it
        // FIXME: this is probably bad check if table exists every query
        db.query(initializeCounter).then(async data => {
            // grab third element since its the update command which has freshest data
            db.query(increaseCounter).then(data => {
                const counterValue = data.rows[0].counter;
                if (counterValue) res.status(200).send({ message: "Counter incremented", counterValue });
                else res.status(400).send({ message: "There was issue incrementing counter!" });
            }).catch(err => console.log(err.message));
        }).catch(err => { res.status(400).send(err.message) });
    } catch (err) {
        console.log(err instanceof Error ? err.message : err);
        res.status(500).send({ message: "Interal Server Error" });
    }
})


export default router;