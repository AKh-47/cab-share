import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db";

const socketio = require("socket.io");
import { Socket } from "socket.io";
import socketHandler from "./socket";

import tripRoutes from "./routes/Trip";
import authRoutes from "./routes/Auth";

import userRoutes from "./routes/User";
import driverRoutes from "./routes/Driver";

const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
connectDB();

const httpServer = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}...`)
);

const io = socketio(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use("/trip", tripRoutes);
app.use("/auth", authRoutes);

app.use("/user", userRoutes);
app.use("/driver", driverRoutes);

io.on("connection", (socket: Socket) => socketHandler(socket, io));

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: true,
    message: err.message,
  });
});

// Behaviour
// A user can also register as a driver
