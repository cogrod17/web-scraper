interface Journey {
  duration: string;
  stops: number;
}

export class Trip {
  constructor(
    // private orgin: string,
    // private destination: string,
    private outbound: Journey,
    private returnTrip: Journey,
    private price: number
  ) {}
}

export class TripList {
  public sort: string;
  constructor(private trips: object[]) {
    this.sort = "price";
  }
}
