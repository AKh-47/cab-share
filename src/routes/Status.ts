import express, { Request, Response, NextFunction } from "express";
import Driver from "../models/Driver";
import User from "../models/User";

const router = express.Router();

router.post(
  "/driver/available",
  (req: Request, res: Response, next: NextFunction) => {}
);

router.post(
  "/user/looking",
  (req: Request, res: Response, next: NextFunction) => {}
);

export default router;
