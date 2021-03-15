import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import Driver from "../models/Driver";
import User from "../models/User";

const router = express.Router();

router.post(
  "/user/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, city } = req.body;

      const exisitngUser = await User.findOne({ email });

      if (exisitngUser) {
        return res.json({
          message: "User already Exists",
        });
      }

      let user = new User({
        name,
        email,
        password,
        city,
      });

      user = await user.save();

      res.status(200).json({
        message: "User Created Succesfully",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/user/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.json({
          message: "User does not exist",
        });
      }

      const isMatch = user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }

      if (!process.env.SECRET) throw new Error("Invalied Environment");

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, type: "user" },
        process.env.SECRET
      );

      res.status(200).send({
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/driver/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, city, cab, currentLocation } = req.body;

      const exisitngDriver = await Driver.findOne({ email });

      if (exisitngDriver) {
        return res.json({
          message: "Driver already Exists",
        });
      }

      let driver = new Driver({
        name,
        email,
        password,
        city,
        cab,
        currentLocation: JSON.stringify(currentLocation),
      });

      driver = await driver.save();

      res.status(200).json({
        message: "Driver Added Succesfully",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/driver/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const driver = await Driver.findOne({ email });

      if (!driver) {
        return res.json({
          message: "Driver does not exist",
        });
      }

      const isMatch = driver.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }

      if (!process.env.SECRET) throw new Error("Invalied Environment");

      const token = jwt.sign(
        {
          id: driver._id,
          name: driver.name,
          email: driver.email,
          type: "driver",
        },
        process.env.SECRET
      );

      res.status(200).send({
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
