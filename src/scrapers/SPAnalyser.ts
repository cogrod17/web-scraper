import cheerio from "cheerio";
import axios from "axios";

type SymbolPrice = {
  name: string;
  symbol: string;
  price: string | number;
  percent_change: number;
}[];

export const getSPCompanies = async () => {
  const { data } = await axios.get("https://www.slickcharts.com/sp500");
  const $ = cheerio.load(data);
  //   console.log($("thead").text());
  let list: SymbolPrice = [];

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

  //   console.log(list);
  return list;
};

getSPCompanies();
