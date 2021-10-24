"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSkyscanner = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
var searchSkyscanner = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, browser, page, content, $, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "https://www.skyscanner.net";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 17, , 18]);
                console.log("searching Skyscanner");
                return [4, puppeteer_extra_1.default.launch({
                        ignoreHTTPSErrors: true,
                    })];
            case 2:
                browser = _a.sent();
                return [4, browser.newPage()];
            case 3:
                page = _a.sent();
                console.log("navigating to page");
                return [4, page.goto(url, {
                        waitUntil: "domcontentloaded",
                    })];
            case 4:
                _a.sent();
                page.screenshot({ path: "skyscanner.png" });
                return [4, page.waitForSelector("#fsc-origin-search")];
            case 5:
                _a.sent();
                return [4, page.click("#fsc-origin-search")];
            case 6:
                _a.sent();
                return [4, page.keyboard.type("CNX")];
            case 7:
                _a.sent();
                return [4, page.click("#fsc-destination-search")];
            case 8:
                _a.sent();
                return [4, page.keyboard.type("URT")];
            case 9:
                _a.sent();
                return [4, page.click("#depart-fsc-datepicker-button > span")];
            case 10:
                _a.sent();
                return [4, page.keyboard.type("30/10/21")];
            case 11:
                _a.sent();
                return [4, page.click("#return-fsc-datepicker-button > span")];
            case 12:
                _a.sent();
                return [4, page.keyboard.type("05/11/21")];
            case 13:
                _a.sent();
                return [4, page.click("#flights-search-controls-root > div > div > form > div:nth-child(3) > button")];
            case 14:
                _a.sent();
                return [4, page.waitForSelector("#app-root > div.FlightsDayView_row__NjQyZ > div > div > div > div:nth-child(1) > div.FlightsResults_dayViewItems__ZDFlO")];
            case 15:
                _a.sent();
                return [4, page.content()];
            case 16:
                content = _a.sent();
                $ = cheerio_1.default.load(content);
                getPrices($);
                console.log("done");
                return [3, 18];
            case 17:
                e_1 = _a.sent();
                console.log("there was an error");
                console.log(e_1);
                return [3, 18];
            case 18: return [2];
        }
    });
}); };
exports.searchSkyscanner = searchSkyscanner;
(0, exports.searchSkyscanner)();
function getPrices($) {
    var prices = [];
    $("div.FlightsResults_dayViewItems__ZDFlO > div")
        .find("div.BpkTicket_bpk-ticket__paper__N2IwN.BpkTicket_bpk-ticket__stub__MGVjZ.Ticket_stub__NGYxN.BpkTicket_bpk-ticket__stub--padded__MzZmN.BpkTicket_bpk-ticket__stub--horizontal__Y2IzN.BpkTicket_bpk-ticket__paper--with-notches__NDVkM > div > div > div")
        .each(function (i, el) {
        var p = $(el).find("span").text();
        prices.push(p);
    });
    console.log(prices);
}
