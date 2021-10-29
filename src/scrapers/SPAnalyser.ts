import cheerio from "cheerio";
import axios from "axios";
// import puppeteer from "puppeteer-extra";
// import Stealth from "puppeteer-extra-plugin-stealth";
// import Blocker from "puppeteer-extra-plugin-adblocker";
// puppeteer.use(Stealth());
// puppeteer.use(Blocker());

interface Symbol {
  name: string;
  symbol: string;
  price: string | number;
  percent_change: number;
  PERatio?: number | string;
  PBRatio?: number | string;
  dividendYield?: number | string;
  PEG?: number | string;
  error?: string;
}
[];

// evaluate("IBM");
// let arr = [
//   "JPM",
//   "IBM",
//   "TSLA",
//   "AAPL",
//   "PYPL",
//   "RIOT",
//   "ABBV",
//   "T",
//   "BAC",
//   "TSLA",
//   "SBUX",
//   "SHOP",
// ];

// for (let i = 0; i < arr.length; i++) {
//   evaluate(arr[i]);
// }

// let obj1 = {
//   name: "cole",
// };

// let obj2 = {
//   age: 24,
// };

// Object.assign(obj1, obj2);
// console.log(obj1);

evaluateSP();

export async function evaluateSP() {
  let list = await getSPCompanies();
  let final: object[];

  for (let i = 0; i < list.length; i++) {
    let obj = await evaluate(list[i].symbol);
    Object.assign(list[i], obj);
    console.log(`${i + 1}/${list.length} symbols finished`);
  }
  console.log(list);
}

export async function evaluate(symbol: string) {
  try {
    const { data } = await axios.get(
      `https://finance.yahoo.com/quote/${symbol}/key-statistics`
    );
    const $ = cheerio.load(data);

    let y = $(
      "#Col1-0-KeyStatistics-Proxy > section > div:nth-child(2) > div:nth-child(2) > div> div:nth-child(3) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2)"
    ).text();
    let divYield = y === "N/A" ? "N/A" : +y.slice(0, y.length - 1);

    let PBRatio: string | number = $(
      "#Col1-0-KeyStatistics-Proxy > section > div:nth-child(2) > div:nth-child(1) > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(2)"
    ).text();
    if (PBRatio !== "N/A") PBRatio = +PBRatio;

    let PEG: string | number = $(
      "#Col1-0-KeyStatistics-Proxy > section > div:nth-child(2) > div:nth-child(1) > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(2)"
    ).text();
    if (PEG !== "N/A") PEG = +PEG;

    let PERatio: string | number = $(
      "#Col1-0-KeyStatistics-Proxy > section > div:nth-child(2) > div:nth-child(1) > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2)"
    ).text();
    if (PERatio !== "N/A") PERatio = +PERatio;

    // console.log({ divYield, PBRatio, PEG, PERatio });
    return { divYield, PBRatio, PEG, PERatio };
  } catch (e) {
    return { error: "there was an error" };
  }
}

export async function getSPCompanies() {
  const { data } = await axios.get("https://www.slickcharts.com/sp500");
  const $ = cheerio.load(data);
  //   console.log($("thead").text());
  let list: Symbol[] = [];

  $("tbody")
    .find("tr")
    .each((i: number, el: any) => {
      const name = $(el).find("td:nth-child(2)").text();
      const symbol = $(el).find("td:nth-child(3)").text();
      const price = +$(el).find("td:nth-child(5)").text().split(",").join("");
      const percentString = $(el).find("td:last-child").text();

      list.push({
        name,
        symbol,
        price,
        percent_change: +percentString.slice(1, percentString.length - 2),
      });
    });

  return list;
}
