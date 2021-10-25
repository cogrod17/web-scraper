import puppeteer from "puppeteer-extra";
import cheerio from "cheerio";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-adblocker";
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlocker());

const searchYahoo = async (symbol: string) => {
  const browser = await puppeteer.launch({
    // headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto("https://finance.yahoo.com", {
    waitUntil: "domcontentloaded",
  });
  await page.click("#yfin-usr-qry");
  await page.keyboard.type(symbol);
  await page.click("#header-desktop-search-button");
  await page.waitForSelector("#quote-summary");
  console.log("landed");
  const content = await page.content();
  const $ = cheerio.load(content);

  //   getQuote($);

  page.screenshot({ path: "yahoo.png" });
  console.log("yahoo finished");
};

searchYahoo("TSLA");

function getQuote($: Function) {
  let quote: string[] = [];
  let x = $("#quote-header-info div:nth-child(3) > div > div")
    .find("span")
    .each((i: number, el: HTMLElement) => {
      quote.push($(el).text());
    });

  console.log(quote);
  return quote;
}
