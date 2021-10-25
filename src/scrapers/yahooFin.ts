import puppeteer from "puppeteer-extra";
import cheerio from "cheerio";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-adblocker";
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlocker());

const LEFT_TABLE_SELECTOR = "#quote-summary > div > table > tbody";
const RIGHT_TABLE_SELECTOR =
  "#quote-summary > div:nth-child(2) > table > tbody";
const PERATIO_SELECTOR = "tr:nth-child(3)";
const EPS_SELECTOR = "tr:nth-child(4)";
const STATISTICS_TAB_SELECTOR = "#quote-nav > ul > li:nth-child(4) > a";
const STATS_CONTAIN_SELECTOR = "#Col1-0-KeyStatistics-Proxy";

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
  let content = await page.content();
  let $ = cheerio.load(content);

  getQuote($);
  getSummary($);

  await page.click(STATISTICS_TAB_SELECTOR);
  await page.waitForNavigation();

  content = await page.content();
  $ = cheerio.load(content);

  getStatistics($);

  page.screenshot({ path: "yahoo.png" });
  console.log("yahoo finished");
};

searchYahoo("TSLA");

function getStatistics($: Function) {
  let data: [string, string][] = [];
  let title: string;
  $(STATS_CONTAIN_SELECTOR)
    .find("tbody")
    .each((i: number, el: HTMLElement) => {
      $(el)
        .find("td")
        .each((i: number, el: HTMLElement) => {
          if ((i + 1) % 2 !== 0) title = $(el).children("span").text();
          else data.push([title, $(el).text()]);
        });
    });
  console.log(data);
  return data;
}

function getSummary($: Function) {
  //   let x = $(RIGHT_TABLE_SELECTOR).find(PERATIO_SELECTOR).text();
  let tableData: [string, string][] = [];

  $(RIGHT_TABLE_SELECTOR)
    .find("tr")
    .each((i: number, el: HTMLElement) => {
      let firstTd: string;
      $(el)
        .find("td")
        .each((i: number, el: HTMLElement) => {
          let cur = $(el).text();

          if (i === 0) firstTd = cur;
          else tableData.push([firstTd, cur]);
        });
    });

  $(LEFT_TABLE_SELECTOR)
    .find("tr")
    .each((i: number, el: HTMLElement) => {
      let firstTd: string;
      $(el)
        .find("td")
        .each((i: number, el: HTMLElement) => {
          let cur = $(el).text();

          if (i === 0) firstTd = cur;
          else tableData.push([firstTd, cur]);
        });
    });
  console.log(tableData);
  return tableData;
}

function getQuote($: Function) {
  let quote: string[] = [];
  let x = $("#quote-header-info div:nth-child(3) > div > div")
    .find("span")
    .each((i: number, el: HTMLElement) => {
      if (i <= 1) quote.push($(el).text());
    });

  console.log(quote);
  return quote;
}
