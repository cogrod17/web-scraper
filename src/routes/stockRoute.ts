import express from "express";
import { searchYahoo } from "../scrapers/yahooFin.js";
import { getSPCompanies, evaluate } from "../scrapers/SPAnalyser.js";

const router = express.Router();

router.get("/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const info = await searchYahoo(symbol);

    res.status(200).send(info);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "there was an error" });
  }
});

router.get("/stock/key-statistics/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const data = await evaluate(symbol);

    res.status(200).send(data);
  } catch (e) {
    res.status(400).send({ error: "There was an error" });
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
