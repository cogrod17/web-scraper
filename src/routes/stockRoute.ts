import express from "express";
import { searchYahoo } from "../scrapers/yahooFin.js";
import { getSPCompanies } from "../scrapers/SPAnalyser.js";

const router = express.Router();

router.get("/stock/:symbol", async (req, res) => {
  try {
    const info = await searchYahoo(req.params.symbol);
    res.status(200).send(info);
  } catch (e) {
    res.status(500).send({ error: "there was an error" });
  }
});

router.get("/s&p500_list", async (req, res) => {
  try {
    const list = await getSPCompanies();
    res.status(200).send(list);
  } catch (e) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

export default router;
