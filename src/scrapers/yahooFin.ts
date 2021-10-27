import puppeteer from "puppeteer-extra";
import cheerio from "cheerio";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-adblocker";
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlocker());

const LEFT_TABLE_SELECTOR = "#quote-summary > div > table > tbody";
const RIGHT_TABLE_SELECTOR =
  "#quote-summary > div:nth-child(2) > table > tbody";
const STATISTICS_TAB_SELECTOR = "#quote-nav > ul > li:nth-child(4) > a";
const STATS_CONTAIN_SELECTOR = "#Col1-0-KeyStatistics-Proxy";
const HISTORY_SELECTOR = "#quote-nav > ul > li:nth-child(5) > a";
const HISTORY_TABLE_SELECTOR =
  "#Col1-1-HistoricalDataTable-Proxy > section > div:nth-child(2) > table";
const FIN_TAB_SELECTOR = "#quote-nav > ul > li:nth-child(7) > a";
const INCOME_STATEMENT_TABLE =
  "#Col1-1-Financials-Proxy > section > div:nth-child(3) > div > div > div:nth-child(2)";

export const searchYahoo = async (symbol: string) => {
  console.log("seaching yahoo");
  const browser = await puppeteer.launch({
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

  ////////////////////////////////////
  const [summary, quote] = await getSummaryAndQuote(page);
  const stats = await getStatistics(page);
  const history = await getHistory(page);
  const incomeStatement = await getIncomeStatement(page);
  ////////////////////////////////////

  return { quote, summary, stats, history, incomeStatement };
};

// searchYahoo('JPM')

/////////////////////////////////
/////////////////////////////////

interface LooseObj {
  [key: string]: string | number;
}

interface Day {
  [key: string]: number | string;
}

type History = Day[];

/////////////////////////////////
/////////////////////////////////

async function getIncomeStatement(page: any) {
  console.log("getting income statement");
  await page.click(FIN_TAB_SELECTOR);
  await page.waitForTimeout(3000);
  page.screenshot({ path: "yahoo.png" });
  const content = await page.content();
  const $ = cheerio.load(content);

  let keys: string[] = [];
  let ttm: string[] = [];
  let final: { [keys: string]: string } = {};
  $(INCOME_STATEMENT_TABLE + " > div > div > div")
    .find("div:first-child")
    .each((i: number, el: any) => {
      keys.push($(el).text());
    });

  $(INCOME_STATEMENT_TABLE + " > div > div")
    .find("div:nth-child(2)")
    .each((i: number, el: any) => {
      let cur = $(el).text();
      if (cur !== "") ttm.push(cur);
    });

  for (let i = 0; i < keys.length; i++) {
    final[keys[i].split(" ").join("")] = ttm[i];
  }
  return final;
}

/////////////////////////////////
/////////////////////////////////

async function getHistory(page: any) {
  try {
    await page.click(HISTORY_SELECTOR);
    await page.waitForNavigation();
    await getToBottom(page);
    const content = await page.content();
    const $ = cheerio.load(content);

    let keys: string[] = [];
    let history: History = [];

    $(HISTORY_TABLE_SELECTOR)
      .find("thead")
      .find("tr")
      .find("th")
      .each((i: number, el: any) => {
        let text = $(el).text().split("*").join("").split(" ").join("");
        keys.push(text);
      });

    $(HISTORY_TABLE_SELECTOR)
      .children("tbody")
      .find("tr")
      .each((i: number, el: any) => {
        let dayData: Day = {};
        $(el)
          .find("td")
          .each((i: number, el: any) => {
            let cur: string | number;
            cur = i === 0 || i === 6 ? $(el).text() : +$(el).text();
            dayData[keys[i]] = cur;
            if (i === 6) history.push(dayData);
          });
      });

    return history;
  } catch (e) {
    return { error: "there was an error" };
  }
}

/////////////////////////////////
/////////////////////////////////

async function getStatistics(page: any) {
  await page.click(STATISTICS_TAB_SELECTOR);
  await page.waitForNavigation();
  const content = await page.content();
  const $ = cheerio.load(content);

  let obj: LooseObj = {};
  let title: string;
  $(STATS_CONTAIN_SELECTOR)
    .find("tbody")
    .each((i: number, el: any) => {
      $(el)
        .find("td")
        .each((i: number, el: any) => {
          if ((i + 1) % 2 !== 0) title = $(el).children("span").text();
          else obj[title] = $(el).text();
        });
    });
  return obj;
}
/////////////////////////////////
/////////////////////////////////

async function getSummaryAndQuote(page: any) {
  let content = await page.content();
  let $ = cheerio.load(content);

  let data: LooseObj = {};

  $(RIGHT_TABLE_SELECTOR)
    .find("tr")
    .each((i: number, el: any) => {
      let firstTd: string;
      $(el)
        .find("td")
        .each((i: number, el: any) => {
          let cur = $(el).text();
          if (i === 0) firstTd = cur;
          else data[firstTd] = cur;
        });
    });

  $(LEFT_TABLE_SELECTOR)
    .find("tr")
    .each((i: number, el: any) => {
      let firstTd: string;
      $(el)
        .find("td")
        .each((i: number, el: any) => {
          let cur = $(el).text();
          if (i === 0) firstTd = cur;
          else data[firstTd] = cur;
        });
    });

  return [data, getQuote($)];
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
  quote.price = +temp[0].split(",").join("");
  quote.dollarChange = +dollar_change;
  quote.percentChange = +percent_change.slice(1, percent_change.length - 2);
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
