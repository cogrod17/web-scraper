import cheerio from "cheerio";
import puppeteer from "puppeteer";

export const searchSkyscanner = async () => {
  console.log("searching Skyscanner");
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();

  await page.goto("https://www.skyscanner.net", {
    waitUntil: "domcontentloaded",
  });
  let content = await page.content();
  //   console.log(content);/
  const $ = cheerio.load(content);

  //   let form = $("#flights-search-controls-root")
  //   let form = $(
  //     "#flights-search-controls-root > div > div > form > div.SingleDestControls_SingleDestControls__1W27b"
  //   );
  // let form = $("#flights-search-controls-root");
  let form = $("#pagewrap").html();
  console.log(form);
};

searchSkyscanner();
