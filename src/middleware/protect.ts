import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type options = "user" | "driver";

export default (opt: options) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) throw new Error("z");

      if (!process.env.SECRET) throw new Error("Environment Invalid");

      const user = jwt.verify(token, process.env.SECRET);

      //@ts-ignore
      req.user = user;

      //@ts-ignore
      if (req.user.type != opt) throw new Error("a");

      next();
    } catch (err) {
      console.log(err);

      res.status(401).json({
        message: "Auth Failed",
      });
    }
  };
};
