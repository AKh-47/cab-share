import express, { Request, Response, NextFunction } from "express";
import Driver from "../models/Driver";
import Review from "../models/Review";

const router = express.Router();

router.post(
  "/available",
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = await Driver.findById(req.body.driverID);
    driver.isAvailable = !driver.isAvailable;
    driver.save();
  }
);

router.get(
  "/reviews",
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find({ for: req.body.driverID });
  }
);

export default router;
