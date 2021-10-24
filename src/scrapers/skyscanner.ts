import cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { URLSearchParams } from "url";

puppeteer.use(StealthPlugin());

export const searchSkyscanner = async () => {
  const url = "https://www.skyscanner.net";
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
    await page.keyboard.type("CNX");
    await page.click("#fsc-destination-search");
    await page.keyboard.type("URT");
    await page.click("#depart-fsc-datepicker-button > span");
    await page.keyboard.type("30/10/21");
    await page.click("#return-fsc-datepicker-button > span");
    await page.keyboard.type("05/11/21");
    await page.click(
      "#flights-search-controls-root > div > div > form > div:nth-child(3) > button"
    );
    // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(
      "#app-root > div.FlightsDayView_row__NjQyZ > div > div > div > div:nth-child(1) > div.FlightsResults_dayViewItems__ZDFlO"
    );
    // page.screenshot({ path: "skyscanner.png" });

    let content = await page.content();
    const $ = cheerio.load(content);

    getPrices($);

    console.log("done");
  } catch (e) {
    console.log("there was an error");
    console.log(e);
  }
};

searchSkyscanner();

//div.BpkTicket_bpk-ticket__paper__N2IwN.BpkTicket_bpk-ticket__stub__MGVjZ.Ticket_stub__NGYxN.BpkTicket_bpk-ticket__stub--padded__MzZmN.BpkTicket_bpk-ticket__stub--horizontal__Y2IzN.BpkTicket_bpk-ticket__paper--with-notches__NDVkM > div > div > div

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
  console.log(prices);
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
