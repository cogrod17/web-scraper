import express from "express";
import { searchKayak } from "../scrapers/searchKayak.js";
import { searchMomo } from "../scrapers/momondo.js";

const router = express.Router();

interface ReturnPromise {
  status: string;
  value: string | object[];
}

router.get("/flights", async (req, res) => {
  try {
    const data = await Promise.allSettled([searchKayak(), searchMomo()]);

    let response = data.filter(
      (res) => res.status === "fulfilled"
    ) as PromiseFulfilledResult<any>[];

    let [kayak, momo] = response;
    let final: object[] = [];
    if (kayak.status === "fulfilled") final.push(...kayak.value);
    if (momo.status === "fulfilled") final.push(...momo.value);

    res.status(200).send(final);
  } catch (e) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

export default router;
