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

  socket.on(
    "looking-for-share",
    (userID: string, from: string, to: string, people: string) => {
      let best = 0;
      const trips = Trip.find({
        solo: false,
        hasEnded: false,
        "driver.city": city,
      }).populate("driver", "cab currentLocation");

      trips.map((trip) => {
        if (trip.driver.cab.capcity - trip.customers.length >= people) {
          let distBetweenEndpoints: number;

          trip.customers.forEach((customer: any) => {
            const dist = getDistanceBetweenCoords(customer.to, to);
            if (dist > distBetweenEndpoints) {
              distBetweenEndpoints = dist;
            }
          });

          // const city = getCityFromCoords(from);
          // const users = User.find({ isLookingForshare: true, city });
          // Implement checking with other users locations before confirming trip

          const distBetweenDriver = getDistanceBetweenCoords(
            trip.driver.currentLocation,
            from
          );

          // Simple algo which compares distances
          // Can do a better job then this

          best =
            best > distBetweenDriver + distBetweenEndpoints
              ? distBetweenDriver + distBetweenEndpoints
              : best;
        }
      });

      socket.emit("found-share-trip", best);
    }
  );
};
