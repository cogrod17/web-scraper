import cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const searchSkyscanner = async () => {
  try {
    console.log("searching Skyscanner");
    let browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
    });
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.emulateTimezone("Asia/Singapore");
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    // );

    console.log("navigating to page");
    await page.goto("https://www.skyscanner.net", {
      waitUntil: "domcontentloaded",
    });
    // page.screenshot({ path: "skyscanner.png" });
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
    // await page.waitForNavigation();
    // page.screenshot({ path: "skyscanner.png" });
    let content = await page.content();
    const $ = cheerio.load(content);
    console.log("done");
  } catch (e) {
    console.log("there was an error");
    console.log(e);
  }
};

searchSkyscanner();
