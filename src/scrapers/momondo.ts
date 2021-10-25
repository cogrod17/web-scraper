import cheerio from "cheerio";
import axios from "axios";
import {
  getDuration,
  getStops,
  getPrice,
  getAirlines,
  merge,
} from "./searchKayak";

export const searchMomo = async () => {
  let w = "two";
  try {
    // throw new Error();
    let res = await axios.get(
      "https://www.momondo.com/flight-search/DEN-NYC/2021-11-23/2021-11-30?sort=price_a"
    );
    const $ = cheerio.load(res.data);
    const duration = getDuration($, w);
    const stops = getStops($, w);
    const prices = getPrice($);
    const airlines = getAirlines($, w);
    return merge(prices, duration, stops, airlines);
  } catch (e) {
    return "failed";
  }
};
