// @ts-nocheck
import { Socket } from "socket.io";
import Driver from "./models/Driver";
import User from "./models/User";

export default (socket: Socket, io: any) => {
  // Implement Real Time Reflection of Driver's location in the Frontend
  // Driver location only needs to be synchronized when he is available for work
  socket.on(
    "driver-location-update",
    async (driverID: string, coords: string) => {
      await Driver.updateOne({ _id: driverID }, { currentLocation: coords });
      try {
      } catch (err) {
        throw err;
      }
    }
  );

  socket.on("user-location-update", async (userID: string, coords: string) => {
    await User.updateOne({ _id: userID }, { currentLocation: coords });
    try {
    } catch (err) {
      throw err;
    }
  });
};
