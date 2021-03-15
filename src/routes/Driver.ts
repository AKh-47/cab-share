import express, { Request, Response, NextFunction } from "express";
import protect from "../middleware/protect";
import Driver from "../models/Driver";
import Review from "../models/Review";

const router = express.Router();

router.post(
  "/available",
  protect("driver"),
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const driver = await Driver.findById(req.user.id);
    driver.isAvailable = !driver.isAvailable;
    driver.save();

    res.status(200).json({
      error: null,
      message: "Driver is now available",
    });
  }
);

router.get(
  "/reviews",
  protect("driver"),
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find({ for: req.body.driverID });

    res.status(200).json({
      error: null,
      reviews,
    });
  }
);

export default router;
