import puppeteer from "puppeteer-extra";
import cheerio from "cheerio";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-adblocker";
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlocker());

const LEFT_TABLE_SELECTOR = "#quote-summary > div > table > tbody";
const RIGHT_TABLE_SELECTOR =
  "#quote-summary > div:nth-child(2) > table > tbody";
// const PERATIO_SELECTOR = "tr:nth-child(3)";
// const EPS_SELECTOR = "tr:nth-child(4)";
const STATISTICS_TAB_SELECTOR = "#quote-nav > ul > li:nth-child(4) > a";
const STATS_CONTAIN_SELECTOR = "#Col1-0-KeyStatistics-Proxy";
const HISTORY_SELECTOR = "#quote-nav > ul > li:nth-child(5) > a";
const HISTORY_TABLE_SELECTOR =
  "#Col1-1-HistoricalDataTable-Proxy > section > div:nth-child(2) > table";

const searchYahoo = async (symbol: string) => {
  console.log("seaching yahoo");
  const browser = await puppeteer.launch({
    // headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://finance.yahoo.com", {
    waitUntil: "domcontentloaded",
  });
  await page.click("#yfin-usr-qry");
  await page.keyboard.type(symbol);
  await page.click("#header-desktop-search-button");
  await page.waitForSelector("#quote-summary");

  let content;
  let $;

  ////////////////////////////////////
  // console.log("get summary");
  // let content = await page.content();
  // let $ = cheerio.load(content);
  // getQuote($);
  // getSummary($);
  ////////////////////////////////////

  ////////////////////////////////////
  // console.log("getting statistics");
  // await page.click(STATISTICS_TAB_SELECTOR);
  // await page.waitForNavigation();
  // content = await page.content();
  // $ = cheerio.load(content);
  // getStatistics($);
  ////////////////////////////////////

  ////////////////////////////////////
  console.log("getting history");
  await page.click(HISTORY_SELECTOR);
  await page.waitForNavigation();
  await getToBottom(page);
  content = await page.content();
  $ = cheerio.load(content);
  const history = getHistory($);
  // console.log(history[history.length - 1]);

  ////////////////////////////////////

  // page.screenshot({ path: "yahoo.png" });
  console.log("yahoo finished");
};

searchYahoo("TSLA");

/////////////////////////////////
/////////////////////////////////

interface LooseObj {
  [key: string]: string;
}

interface Day {
  [key: string]: number | string;
}

type History = Day[];

/////////////////////////////////
/////////////////////////////////

function getHistory($: Function): History {
  let keys: string[] = [];
  let history: History = [];

  $(HISTORY_TABLE_SELECTOR)
    .find("thead")
    .find("tr")
    .find("th")
    .each((i: number, el: HTMLElement) => {
      let text = $(el).text().split("*").join("").split(" ").join("");
      keys.push(text);
    });

  $(HISTORY_TABLE_SELECTOR)
    .children("tbody")
    .find("tr")
    .each((i: number, el: HTMLElement) => {
      let dayData: Day = {};
      $(el)
        .find("td")
        .each((i: number, el: HTMLElement) => {
          let cur: string | number;
          cur = i === 0 || i === 6 ? $(el).text() : +$(el).text();
          dayData[keys[i]] = cur;
          if (i === 6) history.push(dayData);
        });
    });
  return history;
}

/////////////////////////////////
/////////////////////////////////

function getStatistics($: Function) {
  let obj: LooseObj = {};
  let title: string;
  $(STATS_CONTAIN_SELECTOR)
    .find("tbody")
    .each((i: number, el: HTMLElement) => {
      $(el)
        .find("td")
        .each((i: number, el: HTMLElement) => {
          if ((i + 1) % 2 !== 0) title = $(el).children("span").text();
          else obj[title] = $(el).text();
        });
    });
  return obj;
}
/////////////////////////////////
/////////////////////////////////

function getSummary($: Function) {
  let data: LooseObj = {};

  $(RIGHT_TABLE_SELECTOR)
    .find("tr")
    .each((i: number, el: HTMLElement) => {
      let firstTd: string;
      $(el)
        .find("td")
        .each((i: number, el: HTMLElement) => {
          let cur = $(el).text();
          if (i === 0) firstTd = cur;
          else data[firstTd] = cur;
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
          else data[firstTd] = cur;
        });
    });
  return data;
}

/////////////////////////////////
/////////////////////////////////

function getQuote($: Function) {
  let temp: string[] = [];
  let quote: LooseObj = {};
  let x = $("#quote-header-info div:nth-child(3) > div > div")
    .find("span")
    .each((i: number, el: HTMLElement) => {
      if (i <= 1) temp.push($(el).text());
    });

  const [dollar_change, percent_change] = temp[1].split(" ");
  quote.price = temp[0];
  quote.dollarChange = dollar_change;
  quote.percentChange = percent_change;
  return quote;
}

/////////////////////////////////
/////////////////////////////////
async function getToBottom(page: any) {
  const delay = 3000;
  let preCount: number = 0;
  let postCount: number = 0;
  do {
    preCount = await getCount(page);
    await scrollDown(page);
    await page.waitForTimeout(delay);
    postCount = await getCount(page);
  } while (preCount < postCount);
  await page.waitForTimeout(delay);
}

async function getCount(page: any) {
  return await page.$$eval(
    HISTORY_TABLE_SELECTOR + " > tbody > tr",
    (a: []) => a.length
  );
}

async function scrollDown(page: any) {
  await page.$eval("tfoot", (el: HTMLElement) => {
    el.scrollIntoView();
  });
}
/////////////////////////////////
/////////////////////////////////
