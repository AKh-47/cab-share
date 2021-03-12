import express, { Request, Response, NextFunction } from "express";
import Driver from "../models/Driver";
import Trip from "../models/Trip";

const router = express.Router();

router.get("/fare", (req: Request, res: Response, next: NextFunction) => {
  const { people, from, to, solo } = req.body;

  // Example from 41.43206,-81.38992
  // Lattitude Langitude data

  const fare = getFareFromCoords(from, to, solo);

  // A very basic pricing scheme
  // Example: upto 5k will be 60 rupees for one person, 90 for two people
  // Example: upto 5k will be 50 rupees for one person, 70 for two people  (for share)
  // solo = true if user wants to go alone
  // Everytime a 5 multiple crosses the price will double
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { user, from, to, people } = req.body;
  // people is the number of people
  // remove user after implemeting auth (take user from there)

  const city = await getCityFromCoords(from);
  const fare = await getFareFromCoords(from, to);

  // I split up drivers by city so the list becomes smaller

  // Find a driver in the current city who is available and is not in a trip(solo)
  // Also checks if his cab has enough capacity for the number of people
  const drivers = await Driver.find({
    city,
    isAvailable: true,
    inTrip: false,
    "cab.capacity": { $gte: people },
    // Checks if capacity is greater that number of people
  });

  const driver = await getClosestDriver(drivers, from);

  driver.inTrip = true;
  await driver.save();

  const trip = await new Trip({
    driver,
    customers: [{ user, from, to, fare }],
    solo: true,
  }).save();

  res.status(200).json({
    trip,
  });
});

router.post("/share", (req: Request, res: Response, next: NextFunction) => {
  const { user, from, to } = req.body;

  const city = getCityFromCoords(from);

  // const trip = Trip.find({"driver.currentLocation"})

  const drivers = Driver.find({ city });

  const driver = drivers[0];

  // If suitable trip is not found
  // const trip = new Trip({
  //   driver,
  //   customers: [{ user, from, to }],
  // });

  // res.status(200).json({})
});

router.post("/end", (req: Request, res: Response, next: NextFunction) => {
  // End a trip
});

const getCityFromCoords = (coords: string) => {
  //Need to implement this
};

const getClosestDriver = (drivers: any[], coords: string) => {
  let lowest = 0;
  let driverIndex = 0;

  drivers.forEach((candidate: any, index) => {
    const distance = getDistanceBetweenCoords(
      candidate.currentLocation,
      coords
    );
    if (distance < lowest) {
      lowest = distance;
      driverIndex = index;
    }
  });

  return drivers[driverIndex];
};

const getDistanceBetweenCoords: (from: string, to: string) => number = (
  from,
  to
) => {
  return 1;
};

const getFareFromCoords = (from: string, to: string, solo = true) => {
  const distance = getDistanceBetweenCoords(from, to);
};

export default router;
