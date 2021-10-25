import express from "express";
const app = express();

import flightRoute from "./routes/flightRoute.js";

import "./scrapers/yahooFin.js";

const port = process.env.PORT || 3001;

app.use(express.json(), flightRoute);

app.listen(port, () => {
  console.log("APP IS UP");
});
