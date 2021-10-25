import cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-adblocker";

puppeteer.use(StealthPlugin());
puppeteer.use(AdBlocker());

type Trip = { duration: string; stops?: string; airlines?: string };

interface CompleteTrip {
  price: string;
  outbound: Trip;
  return: Trip;
}

export const searchSkyscanner = async () => {
  const url = "https://www.skyscanner.net";
  let w = "two";
  try {
    console.log("searching Skyscanner");
    let browser = await puppeteer.launch({
      // headless: false,
      ignoreHTTPSErrors: true,
    });
    // const context = browser.defaultBrowserContext();
    // await context.overridePermissions(url, ["geolocation"]);
    let page = await browser.newPage();
    // await page.setGeolocation({ latitude: 25.7617, longitude: 80.1918 });
    // await page.evaluateOnNewDocument(setLoc);
    // await page.setViewport({ width: 1920, height: 1080 });
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    // );

    console.log("navigating to page");
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    page.screenshot({ path: "skyscanner.png" });
    await page.waitForSelector("#fsc-origin-search");
    await page.click("#fsc-origin-search");
    await page.keyboard.type("Denver");
    await page.click("#fsc-destination-search");
    await page.keyboard.type("Los Angeles");
    await page.click("#depart-fsc-datepicker-button > span");
    await page.keyboard.type("30/10/21");
    await page.click("#return-fsc-datepicker-button > span");
    await page.keyboard.type("05/11/21");
    await page.click(
      "#flights-search-controls-root > div > div > form > div:nth-child(3) > button"
    );
    await page.waitForSelector(
      "#app-root > div.FlightsDayView_row__NjQyZ > div > div > div > div:nth-child(1) > div.FlightsResults_dayViewItems__ZDFlO"
    );
    page.screenshot({ path: "skyscanner.png" });
    let content = await page.content();
    const $ = cheerio.load(content);

    //let prices =  getPrices($);
    // const durations = getDurations($, w);
    // getAirlines($);

    console.log("done");
  } catch (e) {
    return "failed";
    // console.log(e);
  }
};

// searchSkyscanner();

//<span class="BpkText_bpk-text__YWQwM BpkText_bpk-text--xl__MmE4Y">17:40</span>

function getAirlines($: Function) {
  let airlines: string[] = [];

  $(".FlightsTicket_container__NWJkY")
    .find(".LegDetails_container__MTkyZ")
    .each((i: number, el: HTMLElement) => {
      let cur = $(el).text();
      airlines.push(cur);
    });
  console.log(airlines);
}

function getDurations($: Function, ways: string) {
  let duration: [string, string?][] = [];
  let lastDur: string;
  $(".FlightsTicket_container__NWJkY")
    .find("div.LegInfo_stopsContainer__NWIyN > span")
    .each((i: number, el: HTMLElement) => {
      let cur = $(el).text();

      if (ways === "one") duration.push(cur);
      else {
        if ((i + 1) % 2 === 0) duration.push([lastDur, cur]);
        else lastDur = cur;
      }
    });
  console.log(duration);
  return duration;
}

function getPrices($: Function) {
  let prices: string[] = [];

  $("div.FlightsResults_dayViewItems__ZDFlO > div")
    .find(
      "div.BpkTicket_bpk-ticket__paper__N2IwN.BpkTicket_bpk-ticket__stub__MGVjZ.Ticket_stub__NGYxN.BpkTicket_bpk-ticket__stub--padded__MzZmN.BpkTicket_bpk-ticket__stub--horizontal__Y2IzN.BpkTicket_bpk-ticket__paper--with-notches__NDVkM > div > div > div"
    )
    .each((i: number, el: any) => {
      let p = $(el).find("span").text();

      prices.push(p);
    });
  // console.log(prices);
  return prices;
}

// function setLoc() {
//   navigator.geolocation.getCurrentPosition = function (cb) {
//     setTimeout(() => {
//       cb({
//         coords: {
//           accuracy: 21,
//           altitude: null,
//           altitudeAccuracy: null,
//           heading: null,
//           latitude: 25.7617,
//           longitude: 80.1918,
//           speed: null,
//         },
//         timestamp: Date.now(),
//       });
//     }, 1000);
//   };
// }
