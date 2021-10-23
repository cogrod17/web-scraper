"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripList = exports.Trip = void 0;
var Trip = (function () {
    function Trip(outbound, returnTrip, price) {
        this.outbound = outbound;
        this.returnTrip = returnTrip;
        this.price = price;
    }
    return Trip;
}());
exports.Trip = Trip;
var TripList = (function () {
    function TripList(trips) {
        this.trips = trips;
        this.sort = "price";
    }
    return TripList;
}());
exports.TripList = TripList;
