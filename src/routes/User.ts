import express, { Request, Response, NextFunction } from "express";
import User from "../models/User";

const router = express.Router();

router.post(
  "/looking",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    // get user from Auth later
    user.isLooking = !user.isLooking;
    await user.save();
  }
);

router.post(
  "/looking-share",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    // get user from Auth later
    user.isLookingForshare = !user.isLookingForshare;
    await user.save();
  }
);

router.post(
  "/set/home",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    user.home = {
      name: "Home",
      location: req.body.location,
    };
    await user.save();
  }
);

router.post(
  "/set/location",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    user.home = {
      name: req.body.name,
      location: req.body.location,
    };
    await user.save();
  }
);

export default router;
