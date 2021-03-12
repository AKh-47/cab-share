import express, { Request, Response, NextFunction } from "express";
import User from "../models/User";

const router = express.Router();

router.post(
  "/looking",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.id);
    user.isLooking = !user.isLooking;
    user.save();
  }
);

export default router;
