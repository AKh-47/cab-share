import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User";

export const registerHandler = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      error: true,
    });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      error: true,
    });
  }
};
