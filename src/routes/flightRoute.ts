import express from "express";
import { searchKayak } from "../scrapers/searchKayak.js";

const router = express.Router();

router.get("/flights", async (req, res) => {
  try {
    const kayakArr = await searchKayak();

    console.log(kayakArr);

    res.status(200).send(kayakArr);
  } catch (e) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

export default router;
