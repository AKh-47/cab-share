import express, { Request, Response, NextFunction } from "express";
import Driver from "../models/Driver";
import Trip from "../models/Trip";

const router = express.Router();

router.get("/fare", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { people, from, to, solo } = req.body;

    // Example from,to 41.43206,-81.38992
    // Lattitude Langitude data

    const fare = await getFareFromCoords(from, to, solo);

    res.status(200).json({
      error: null,
      fare,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
      fare: null,
    });
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
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
      error: null,
    });
  } catch (err) {
    res.status(400).json({
      trip: null,
      error: err.message,
    });
  }
});

router.post("/share", (req: Request, res: Response, next: NextFunction) => {
  // Implemented with sockets
});

router.post("/end", (req: Request, res: Response, next: NextFunction) => {
  // End a trip
});

const getCityFromCoords = (coords: string) => {
  // API Call
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
  // API call
  return 0;
};

const getFareFromCoords = (from: string, to: string, solo = true) => {
  const distance = getDistanceBetweenCoords(from, to);

  return 10;
};

export default router;
