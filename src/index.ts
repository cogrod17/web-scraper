import express from "express";
const app = express();

import flightRoute from "./routes/flightRoute.js";
import stockRoute from "./routes/stockRoute.js";

import "./scrapers/SPAnalyser.js";

const port = process.env.PORT || 3001;

app.use(express.json(), flightRoute, stockRoute);

app.listen(port, () => {
  console.log("APP IS UP");
});
