"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var flightRoute_js_1 = __importDefault(require("./routes/flightRoute.js"));
require("./scrapers/yahooFin.js");
var port = process.env.PORT || 3001;
app.use(express_1.default.json(), flightRoute_js_1.default);
app.listen(port, function () {
    console.log("APP IS UP");
});
