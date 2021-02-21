import express, { Request, Response, NextFunction } from "express";
import Driver from "../models/Driver";
import Trip from "../models/Trip";

const router = express.Router();

router.get("/fare", (req: Request, res: Response, next: NextFunction) => {
  const { cab, from, to } = req.body;
  // Give user the cost depending on the lovcation
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  const { user, from, to } = req.body;

  const city = getCityFromCoords(from);

  // I split up drivers by city so the list becomes smaller
  const drivers = Driver.find({ city });

//   const driver = drivers[0];

  const trip = new Trip({
    driver,
    customers: [{ user, from, to }],
  });

  //   res.status(200).json({})
});

router.post("/share", (req: Request, res: Response, next: NextFunction) => {
  const { user, from, to } = req.body;

  const city = getCityFromCoords(from);

  const trip = Trip.find({"driver.currentLocation"})

  const drivers = Driver.find({ city });

  const driver = drivers[0];



  // If suitable trip is not found
  const trip = new Trip({
    driver,
    customers: [{ user, from, to }],
  });

  // res.status(200).json({})
});

const getCityFromCoords = (coords: string) => {
  //Need to implement this
};

const getClosestDriver = (drivers: any[],coords:string) => {
  //Need to implement this
};

export default router;
