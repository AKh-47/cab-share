// @ts-nocheck
import { Socket } from "socket.io";

export default (socket: Socket, io: any) => {
  // Implement Real Time Reflection of Driver's location in the Frontend
  socket.on("driver-location-update", async () => {
    try {
    } catch (err) {
      throw err;
    }
  });
};
