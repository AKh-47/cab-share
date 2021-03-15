import express, { Request, Response, NextFunction } from "express";
import protect from "../middleware/protect";
import User from "../models/User";

const router = express.Router();

// router.post(
//   "/looking",
//   protect("user"),
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = await User.findById(req.body.userID);
//     user.isLooking = !user.isLooking;
//     await user.save();

//     res.status(200).json({
//       error: null,
//       message: "User status set to looking",
//     });
//   }
// );

router.post(
  "/looking-share",
  protect("user"),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    // get user from Auth later
    user.isLookingForshare = !user.isLookingForshare;
    await user.save();

    res.status(200).json({
      error: null,
      message: "User status set to looking for share",
    });
  }
);

router.post(
  "/set/home",
  protect("user"),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    user.home = {
      name: "Home",
      location: req.body.location,
    };
    await user.save();

    res.status(200).json({
      error: null,
      message: "User home is set",
    });
  }
);

router.post(
  "/set/location",
  protect("user"),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userID);
    user.home = {
      name: req.body.name,
      location: req.body.location,
    };
    await user.save();

    res.status(200).json({
      error: null,
      message: "Location Added",
    });
  }
);

export default router;
