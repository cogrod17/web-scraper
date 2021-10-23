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
exports.searchKayak = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var axios_1 = __importDefault(require("axios"));
var searchKayak = function () { return __awaiter(void 0, void 0, void 0, function () {
    var w, res, $, airlines, prices, times, stops;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                w = "one";
                return [4, axios_1.default.get("https://www.kayak.com/flights/CNX-URT/2021-11-18?sort=price_a")];
            case 1:
                res = _a.sent();
                $ = cheerio_1.default.load(res.data);
                airlines = getScheduleAndAirlines($, w);
                prices = getPrice($);
                times = getDuration($, w);
                stops = getStops($, w);
                return [2, merge(prices, times, stops, airlines)];
        }
    });
}); };
exports.searchKayak = searchKayak;
function merge(prices, times, stops, airlines) {
    var complete = [];
    for (var i = 0; i < prices.length; i++) {
        complete.push({
            price: prices[i],
            outbound: {
                duration: times[i].outbound.duration,
                stops: stops[i][0],
                airlines: airlines[i][0],
            },
            return: {
                duration: times[i].return.duration,
                stops: stops[i][1],
                airlines: airlines[i][1],
            },
        });
    }
    return complete;
}
function getScheduleAndAirlines($, ways) {
    var airlines = [];
    var lastAir;
    $(".section.times > .bottom").each(function (i, el) {
        var x = $(el).text().split("\n").join("").trim();
        if (ways === "one")
            airlines.push([x]);
        else {
            if ((i + 1) % 2 === 0)
                airlines.push([lastAir, x]);
            else
                lastAir = x;
        }
    });
    return airlines;
}
function getPrice($) {
    var prices = [];
    $("div[class=above-button]")
        .find(".price-text")
        .each(function (i, el) {
        prices.push($(el).text().slice(1));
    });
    return prices;
}
function getDuration($, ways) {
    var times = [];
    var lastDur;
    $("ol[class=flights]")
        .find(".section.duration.allow-multi-modal-icons > .top")
        .each(function (i, el) {
        var t = $(el).text().slice(1);
        if (ways === "one")
            times.push({ outbound: { duration: t }, return: { duration: "n/a" } });
        else {
            if ((i + 1) % 2 === 0)
                times.push({
                    outbound: { duration: lastDur },
                    return: { duration: t },
                });
            else
                lastDur = t;
        }
    });
    return times;
}
function getStops($, ways) {
    var lastStop;
    var stops = [];
    $(".flights")
        .find(".stops-text")
        .each(function (i, el) {
        var x = $(el).text().slice(1);
        if (ways === "one")
            stops.push([x]);
        else {
            if ((i + 1) % 2 === 0)
                stops.push([lastStop, x]);
            else
                lastStop = x;
        }
    });
    return stops;
}
