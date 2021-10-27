import express from "express";
import { searchYahoo } from "../scrapers/yahooFin.js";

const router = express.Router();

router.get("/stock/:symbol", async (req, res) => {
  try {
    const info = await searchYahoo(req.params.symbol);
    res.status(200).send(info);
  } catch (e) {
    res.status(500).send({ error: "there was an error" });
  }
});

export default router;
