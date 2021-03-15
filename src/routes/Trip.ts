import express, { Request, Response, NextFunction } from "express";
import { getDistance } from "../config/utils";
import protect from "../middleware/protect";

import Driver from "../models/Driver";
import Trip from "../models/Trip";

const router = express.Router();

router.get(
  "/fare",
  protect("user"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { people, fromCoords, toCoords, solo } = req.body;

      const fare = getFareFromCoords(fromCoords, toCoords, solo, people);

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
  }
);

router.post(
  "/",
  protect("user"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fromCoords, toCoords, people, city } = req.body;

      //@ts-ignore
      const { _id: userID } = req.user;

      // const city = await getCityFromCoords(from);
      // API Needed Here

      const fare = getFareFromCoords(fromCoords, toCoords);

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

      if (drivers.length === 0)
        return res.status(200).json({ message: "Driver not Found" });

      const driver = getClosestDriver(drivers, fromCoords);

      driver.inTrip = true;
      await driver.save();

      const trip = await new Trip({
        driver,
        customers: [
          {
            userID,
            from: JSON.stringify(fromCoords),
            to: JSON.stringify(toCoords),
            fare,
          },
        ],
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
  }
);

router.post(
  "/share",
  protect("user"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fromCoords, toCoords, people, city } = req.body;

      //@ts-ignore
      const { _id: userID } = req.user;

      const trips = await Trip.find({
        solo: false,
        hasEnded: false,
        // "driver.city": city,
      }).populate("driver", "cab currentLocation");

      console.log({ trips });

      const fare = getFareFromCoords(fromCoords, toCoords, false);

      if (trips.length === 0) {
        const drivers = await Driver.find({
          city,
          isAvailable: true,
          inTrip: false,
          "cab.capacity": { $gte: people },
        });

        if (drivers.length === 0)
          return res.status(300).json({ message: "Driver not Found" });

        let driver = getClosestDriver(drivers, fromCoords);
        driver = await Driver.findById(driver._id);
        driver.inTrip = true;
        driver = await driver.save();

        console.log({ driverFromSolo: driver });

        const trip = await new Trip({
          driver,
          customers: [
            {
              user: userID,
              from: JSON.stringify(fromCoords),
              to: JSON.stringify(toCoords),
              fare,
            },
          ],
          solo: false,
        }).save();

        return res.status(200).json({
          trip,
          error: null,
        });
      } else {
        let best: number | null;
        let bestIndex = 0;
        trips.map((trip: any, index: number) => {
          if (!(trip.driver.cab.capcity - trip.customers.length >= people))
            return;

          let distBetweenEndpoints: number | null = null;

          trip.customers.forEach((customer: any) => {
            const dist = getDistance(customer.to, toCoords);
            if (!distBetweenEndpoints || dist > distBetweenEndpoints) {
              distBetweenEndpoints = dist;
            }
          });

          const distBetweenDriver = getDistance(
            trip.driver.currentLocation,
            fromCoords
          );

          //@ts-ignore
          if (!best || best < distBetweenDriver + distBetweenEndpoints) {
            //@ts-ignore
            best = distBetweenDriver + distBetweenEndpoints;
            bestIndex = index;
          }
        });

        let tripID = trips[bestIndex]._id;

        const newCustomer = {
          user: userID,
          from: JSON.stringify(fromCoords),
          to: JSON.stringify(toCoords),
          fare,
        };

        //@ts-ignore
        const trip = await Trip.findByIdAndUpdate(tripID, {
          $push: {
            customers: newCustomer,
          },
        });

        console.log({ tripOutside: trip });

        return res.status(200).json({
          trip,
          error: null,
        });
      }
    } catch (err) {
      res.status(400).json({
        trip: null,
        error: err.message,
      });
    }
  }
);

const getClosestDriver = (drivers: any[], coords: any) => {
  let lowest = 0;
  let driverIndex = 0;

  drivers.forEach((candidate: any, index) => {
    const distance = getDistance(candidate.currentLocation, coords);
    if (distance < lowest) {
      lowest = distance;
      driverIndex = index;
    }
  });

  return drivers[driverIndex];
};

const getFareFromCoords = (from: any, to: any, solo = true, people = 1) => {
  const distance = getDistance(from, to);

  if (solo) {
    return distance > 50 ? 30 : 15;
  } else {
    if (people === 2) return distance > 50 ? 30 : 15;
    if (people === 3) return distance > 50 ? 35 : 18;
    else return distance > 50 ? 25 : 10;
  }
};

export default router;
