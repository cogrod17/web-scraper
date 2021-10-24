import cheerio from "cheerio";
import axios from "axios";

type Trip = { duration: string; stops?: string; airlines?: string };
type StopPair = [string, string?];

interface RoundTrip {
  outbound: Trip;
  return: Trip;
}

interface CompleteTrip {
  price: string;
  outbound: Trip;
  return: Trip;
}

export const searchKayak = async () => {
  let w = "one";

  let res = await axios.get(
    "https://www.kayak.com/flights/CNX-URT/2021-11-18?sort=price_a"
  );
  let $ = cheerio.load(res.data);
  let airlines: [string, string?][] = getScheduleAndAirlines($, w);
  let prices: Array<string> = getPrice($);
  let times: RoundTrip[] = getDuration($, w);
  let stops: StopPair[] = getStops($, w);
  return merge(prices, times, stops, airlines);
};

function merge(
  prices: string[],
  times: RoundTrip[],
  stops: StopPair[],
  airlines: [string, string?][]
): CompleteTrip[] {
  let complete: CompleteTrip[] = [];

  for (let i = 0; i < prices.length; i++) {
    complete.push({
      price: prices[i],
      outbound: {
        duration: times[i].outbound.duration,
        stops: stops[i][0],
        airlines: airlines[i][0],
      },
      return: {
        duration: times[i].return.duration,
        stops: stops[i][1],
        airlines: airlines[i][1],
      },
    });
  }
  console.log(complete);
  return complete;
}

function getScheduleAndAirlines(
  $: Function,
  ways: string
): [string, string?][] {
  let airlines: [string, string?][] = [];
  let lastAir: string;
  $(".section.times > .bottom").each((i: number, el: HTMLElement) => {
    let x = $(el).text().split(`\n`).join("").trim();
    if (ways === "one") airlines.push([x]);
    else {
      if ((i + 1) % 2 === 0) airlines.push([lastAir, x]);
      else lastAir = x;
    }
  });
  return airlines;
}

function getPrice<T extends Function>($: T): string[] {
  let prices: string[] = [];
  $("div[class=above-button]")
    .find(".price-text")
    .each((i: number, el: HTMLElement) => {
      prices.push($(el).text().slice(1));
    });
  return prices;
}

function getDuration<T extends Function>($: T, ways: string): RoundTrip[] {
  let times: RoundTrip[] = [];
  let lastDur: string;
  $("ol[class=flights]")
    .find(".section.duration.allow-multi-modal-icons > .top")
    .each((i: number, el: HTMLElement) => {
      let t = $(el).text().slice(1);
      if (ways === "one")
        times.push({ outbound: { duration: t }, return: { duration: "n/a" } });
      else {
        if ((i + 1) % 2 === 0)
          times.push({
            outbound: { duration: lastDur },
            return: { duration: t },
          });
        else lastDur = t;
      }
    });
  return times;
}

function getStops($: Function, ways: string): StopPair[] {
  let lastStop: string;
  let stops: [string, string?][] = [];
  $(".flights")
    .find(".stops-text")
    .each((i: number, el: HTMLElement) => {
      let x = $(el).text().slice(1);
      if (ways === "one") stops.push([x]);
      else {
        if ((i + 1) % 2 === 0) stops.push([lastStop, x]);
        else lastStop = x;
      }
    });
  return stops;
}
